import pointParticleShaderString from "../shaders/pointParticle.wgsl?raw";

export class ParticleRender {
  positionsBuffer: GPUBuffer;
  textureView: GPUTextureView;

  renderPass: (commandEncoder: GPUCommandEncoder) => void;
  resize: (canvasWidth: number, canvasHeight: number) => void;

  constructor(
    device: GPUDevice,
    cameraDataBuffer: GPUBuffer,
    numObjects: number,
    canvasWidth: number,
    canvasHeight: number
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
      positionsArrayBufferView[i * 4 + 2] = -1 + Math.random() - 0.5;
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

    const textureFormat: GPUTextureFormat = "r16float";
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
            format: textureFormat,
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

    let textureSize = [
      Math.min(device.limits.maxTextureDimension2D, canvasWidth * 2),
      Math.min(device.limits.maxTextureDimension2D, canvasHeight * 2),
    ];

    let renderTexture = device.createTexture({
      size: textureSize,
      format: textureFormat,
      usage:
        GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });

    this.textureView = renderTexture.createView();

    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: this.textureView,
          clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
          loadOp: "clear",
          storeOp: "store",
        },
      ],
    };

    this.resize = (canvasWidth: number, canvasHeight: number) => {
      renderTexture.destroy();
      renderTexture = device.createTexture({
        size: textureSize,
        format: textureFormat,
        usage:
          GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
      });
      this.textureView = renderTexture.createView();
      // @ts-ignore
      renderPassDescriptor.colorAttachments[0].view = this.textureView;
    };

    this.renderPass = (commandEncoder: GPUCommandEncoder) => {
      const renderPassEncoder = commandEncoder.beginRenderPass(
        renderPassDescriptor as GPURenderPassDescriptor
      );

      renderPassEncoder.setPipeline(pipeline);
      renderPassEncoder.setBindGroup(0, bindGroup0);
      renderPassEncoder.setBindGroup(1, bindGroup1);
      renderPassEncoder.draw(numObjects);

      renderPassEncoder.end();
    };
  }
}
