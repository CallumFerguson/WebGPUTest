import boundsShaderString from "../shaders/bounds.wgsl?raw";
import { createBuffer } from "./utility";

export class BoundsRenderer {
  render: (renderPassEncoder: GPURenderPassEncoder) => void;

  constructor(
    device: GPUDevice,
    presentationFormat: GPUTextureFormat,
    cameraDataBuffer: GPUBuffer,
    simulationInfoBuffer: GPUBuffer
  ) {
    const shaderModule = device.createShaderModule({
      code: boundsShaderString,
    });

    const bindGroupLayoutGroup0 = device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {},
        },
        {
          binding: 1,
          visibility: GPUShaderStage.VERTEX,
          buffer: {},
        },
      ],
    });

    const pipelineLayout = device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayoutGroup0],
    });

    const vertices = new Float32Array([
      -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, -0.5,
      -0.5, 0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5,
    ]);
    const indices = new Uint32Array([
      0, 1, 1, 2, 2, 3, 3, 0, 0, 4, 1, 5, 2, 6, 3, 7, 4, 5, 5, 6, 6, 7, 7, 4,
    ]);

    const vertexBuffer = createBuffer(device, vertices, GPUBufferUsage.VERTEX);
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
        topology: "line-list",
        cullMode: "none",
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

    let bindGroup0 = device.createBindGroup({
      layout: bindGroupLayoutGroup0,
      entries: [
        { binding: 0, resource: { buffer: cameraDataBuffer } },
        { binding: 1, resource: { buffer: simulationInfoBuffer } },
      ],
    });

    this.render = (renderPassEncoder: GPURenderPassEncoder) => {
      renderPassEncoder.setPipeline(pipeline);
      renderPassEncoder.setBindGroup(0, bindGroup0);
      renderPassEncoder.setVertexBuffer(0, vertexBuffer);
      renderPassEncoder.setIndexBuffer(indexBuffer, "uint32");
      renderPassEncoder.drawIndexed(indices.length);
    };
  }
}
