import cubeMapShaderString from "../shaders/cubeMap.wgsl?raw";
import { createTextureFromImages } from "webgpu-utils";
import { createBuffer, cubeMapIndices, cubeMapVertices } from "./utility";
import { multisampleCount } from "./constants";

export class CubeMapRenderer {
  render: ((renderPassEncoder: GPURenderPassEncoder) => void) | undefined =
    undefined;

  async init(
    device: GPUDevice,
    presentationFormat: GPUTextureFormat,
    cameraDataBuffer: GPUBuffer
  ) {
    const texture = await createTextureFromImages(
      device,
      [
        "Yokohama/posx.jpg",
        "Yokohama/negx.jpg",
        "Yokohama/posy.jpg",
        "Yokohama/negy.jpg",
        "Yokohama/posz.jpg",
        "Yokohama/negz.jpg",
      ],
      {
        mips: true,
      }
    );

    const vertexBuffer = createBuffer(
      device,
      cubeMapVertices,
      GPUBufferUsage.VERTEX
    );
    const indexBuffer = createBuffer(
      device,
      cubeMapIndices,
      GPUBufferUsage.INDEX
    );

    const shaderModule = device.createShaderModule({
      code: cubeMapShaderString,
    });

    const bindGroupLayoutGroup0 = device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          texture: { viewDimension: "cube" },
        },
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          sampler: {},
        },
        {
          binding: 2,
          visibility: GPUShaderStage.VERTEX,
          buffer: {},
        },
      ],
    });

    const pipelineLayout = device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayoutGroup0],
    });

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
        topology: "triangle-list",
        cullMode: "back",
      },
      multisample: {
        count: multisampleCount,
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less",
        format: "depth24plus",
      },
    };
    const pipeline = device.createRenderPipeline(pipelineDescriptor);

    const sampler = device.createSampler({
      magFilter: "linear",
      minFilter: "linear",
    });

    let bindGroup0 = device.createBindGroup({
      layout: bindGroupLayoutGroup0,
      entries: [
        { binding: 0, resource: texture.createView({ dimension: "cube" }) },
        { binding: 1, resource: sampler },
        { binding: 2, resource: { buffer: cameraDataBuffer } },
      ],
    });

    this.render = (renderPassEncoder: GPURenderPassEncoder) => {
      renderPassEncoder.setPipeline(pipeline);
      renderPassEncoder.setBindGroup(0, bindGroup0);
      renderPassEncoder.setVertexBuffer(0, vertexBuffer);
      renderPassEncoder.setIndexBuffer(indexBuffer, "uint16");
      renderPassEncoder.drawIndexed(cubeMapIndices.length);
    };
  }
}
