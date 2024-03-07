import pointParticleShaderString from "../shaders/pointParticle.wgsl?raw";

export class ParticleRender {
  positionsBuffer: GPUBuffer;
  render: (renderPassEncoder: GPURenderPassEncoder) => void;

  constructor(
    device: GPUDevice,
    presentationFormat: GPUTextureFormat,
    cameraDataBuffer: GPUBuffer,
    numObjects: number
  ) {
    const positionsArrayBuffer = new ArrayBuffer(numObjects * 16);
    const positionsArrayBufferView = new Float32Array(positionsArrayBuffer);
    this.positionsBuffer = device.createBuffer({
      size: positionsArrayBuffer.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    // const position = vec3.create();
    for (let i = 0; i < numObjects; i++) {
      // randomDirection(position, Math.random() * 0.25 + 0.25);

      // positionsArrayBufferView[i * 4 + 2] = -1;

      positionsArrayBufferView[i * 4] = Math.random() * 0.1 - 0.05;
      positionsArrayBufferView[i * 4 + 1] = 0.5 + Math.random() * 0.1;
      positionsArrayBufferView[i * 4 + 2] = -1;
    }
    device.queue.writeBuffer(this.positionsBuffer, 0, positionsArrayBuffer);

    const shaderModule = device.createShaderModule({
      code: pointParticleShaderString,
    });

    const bindGroupLayoutGroup0 = device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {},
        },
      ],
    });

    const bindGroupLayoutGroup1 = device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: { type: "read-only-storage" },
        },
      ],
    });

    const pipelineLayout = device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayoutGroup0, bindGroupLayoutGroup1],
    });

    const pipelineDescriptor: GPURenderPipelineDescriptor = {
      layout: pipelineLayout,
      vertex: {
        module: shaderModule,
        entryPoint: "vert",
        buffers: [],
      },
      fragment: {
        module: shaderModule,
        entryPoint: "frag",
        targets: [
          {
            format: presentationFormat,
            blend: {
              color: {
                operation: "add",
                srcFactor: "one",
                dstFactor: "one",
              },
              alpha: {
                operation: "max",
                srcFactor: "one",
                dstFactor: "one",
              },
            },
          },
        ],
      },
      primitive: {
        topology: "point-list",
        cullMode: "none",
      },
      multisample: {
        count: 1,
      },
    };
    const pipeline = device.createRenderPipeline(pipelineDescriptor);

    const bindGroup0 = device.createBindGroup({
      layout: bindGroupLayoutGroup0,
      entries: [{ binding: 0, resource: { buffer: cameraDataBuffer } }],
    });

    const bindGroup1 = device.createBindGroup({
      layout: bindGroupLayoutGroup1,
      entries: [{ binding: 0, resource: { buffer: this.positionsBuffer } }],
    });

    this.render = (renderPassEncoder: GPURenderPassEncoder) => {
      renderPassEncoder.setPipeline(pipeline);
      renderPassEncoder.setBindGroup(0, bindGroup0);
      renderPassEncoder.setBindGroup(1, bindGroup1);
      renderPassEncoder.draw(numObjects);
    };
  }
}
