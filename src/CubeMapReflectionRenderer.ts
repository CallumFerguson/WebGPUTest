import cubeMapReflectionShaderString from "../shaders/cubeMapReflection.wgsl?raw";
import {
  createTextureFromImages,
  makeShaderDataDefinitions,
  makeStructuredView,
} from "webgpu-utils";
import { createBuffer, cubeIndices, cubeVertexData } from "./utility";
import { multisampleCount } from "./constants";
import { mat4 } from "gl-matrix";

export class CubeMapReflectionRenderer {
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

    const defs = makeShaderDataDefinitions(cubeMapReflectionShaderString);
    const objectData = makeStructuredView(defs.uniforms.objectData);
    const objectDataBuffer = device.createBuffer({
      size: objectData.arrayBuffer.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    objectData.set({
      model: mat4.create(),
    });
    device.queue.writeBuffer(objectDataBuffer, 0, objectData.arrayBuffer);

    const vertexBuffer = createBuffer(
      device,
      cubeVertexData,
      GPUBufferUsage.VERTEX
    );
    const indexBuffer = createBuffer(device, cubeIndices, GPUBufferUsage.INDEX);

    const shaderModule = device.createShaderModule({
      code: cubeMapReflectionShaderString,
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
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          buffer: {},
        },
      ],
    });

    const bindGroupLayoutGroup1 = device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {},
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
        buffers: [
          {
            arrayStride: 6 * 4,
            attributes: [
              { shaderLocation: 0, offset: 0, format: "float32x3" },
              { shaderLocation: 1, offset: 12, format: "float32x3" },
            ],
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

    let bindGroup1 = device.createBindGroup({
      layout: bindGroupLayoutGroup1,
      entries: [{ binding: 0, resource: { buffer: objectDataBuffer } }],
    });

    this.render = (renderPassEncoder: GPURenderPassEncoder) => {
      renderPassEncoder.setPipeline(pipeline);
      renderPassEncoder.setBindGroup(0, bindGroup0);
      renderPassEncoder.setBindGroup(1, bindGroup1);
      renderPassEncoder.setVertexBuffer(0, vertexBuffer);
      renderPassEncoder.setIndexBuffer(indexBuffer, "uint16");
      renderPassEncoder.drawIndexed(cubeIndices.length);
    };
  }
}
