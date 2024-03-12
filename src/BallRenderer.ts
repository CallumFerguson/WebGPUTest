import ballShaderString from "../shaders/ball.wgsl?raw";
import { createBuffer, loadModel } from "./utility";

export class BallRenderer {
  positionsBuffer: GPUBuffer | undefined;

  render: (renderPassEncoder: GPURenderPassEncoder) => void = () => {};

  async init(
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

      positionsArrayBufferView[i * 4] = i / 4 - 1;
      positionsArrayBufferView[i * 4 + 1] = 0;
      positionsArrayBufferView[i * 4 + 2] = -1;
    }
    device.queue.writeBuffer(this.positionsBuffer, 0, positionsArrayBuffer);

    const shaderModule = device.createShaderModule({
      code: ballShaderString,
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

    const { vertices, indices, normals } = await loadModel("sphere.glb");

    const vertexBuffer = createBuffer(device, vertices, GPUBufferUsage.VERTEX);
    const normalBuffer = createBuffer(device, normals, GPUBufferUsage.VERTEX);
    const indexBuffer = createBuffer(device, indices, GPUBufferUsage.INDEX);

    const pipelineDescriptor: GPURenderPipelineDescriptor = {
      layout: pipelineLayout,
      vertex: {
        module: shaderModule,
        entryPoint: "vert",
        buffers: [
          {
            arrayStride: 3 * 4,
            attributes: [{ shaderLocation: 0, offset: 0, format: "float32x3" }],
          },
          {
            arrayStride: 3 * 4,
            attributes: [{ shaderLocation: 1, offset: 0, format: "float32x3" }],
          },
        ],
      },
      fragment: {
        module: shaderModule,
        entryPoint: "frag",
        targets: [
          {
            format: presentationFormat,
          },
        ],
      },
      primitive: {
        topology: "triangle-list",
        cullMode: "back",
      },
      multisample: {
        count: 1,
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less",
        format: "depth24plus",
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

      renderPassEncoder.setVertexBuffer(0, vertexBuffer);
      renderPassEncoder.setVertexBuffer(1, normalBuffer);

      renderPassEncoder.setIndexBuffer(indexBuffer, "uint32");

      renderPassEncoder.drawIndexed(indices.length, numObjects);
    };
  }
}
