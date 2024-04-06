import cameraDataShaderString from "../shaders/cameraData.wgsl?raw";
import equirectangularSkyboxShaderString from "../shaders/equirectangularSkybox.wgsl?raw";
import { parseHDR } from "./parseHDR";
import { multisampleCount } from "./constants";

export class CubeMap {
  texture: GPUTexture | undefined;

  render: ((renderPassEncoder: GPURenderPassEncoder) => void) | undefined =
    undefined;

  async init(device: GPUDevice, cameraDataBuffer: GPUBuffer, imageURI: string) {
    const hdr = await parseHDR(imageURI);

    const equirectangularTexture = device.createTexture({
      size: { width: hdr.width, height: hdr.height },
      format: "rgba16float",
      usage:
        GPUTextureUsage.RENDER_ATTACHMENT |
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST,
    });

    device.queue.writeTexture(
      { texture: equirectangularTexture },
      hdr.data.buffer,
      { bytesPerRow: 8 * hdr.width },
      { width: hdr.width, height: hdr.height }
    );

    const shaderModule = device.createShaderModule({
      code: cameraDataShaderString + equirectangularSkyboxShaderString,
    });

    const bindGroupLayoutGroup0 = device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          texture: {},
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

    const pipelineLayout = device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayoutGroup0],
    });

    const textureFormat = "rgba8unorm";
    const renderTexture = device.createTexture({
      size: [512, 512],
      format: textureFormat,
      usage:
        GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
    this.texture = renderTexture;

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
            format: "bgra8unorm",
          },
        ],
      },
      primitive: {
        topology: "triangle-list",
        cullMode: "back",
      },
      multisample: {
        count: 4,
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less-equal",
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
        { binding: 0, resource: equirectangularTexture.createView() },
        { binding: 1, resource: sampler },
        { binding: 2, resource: { buffer: cameraDataBuffer } },
      ],
    });

    // const renderPassDescriptor: GPURenderPassDescriptor = {
    //   colorAttachments: [
    //     {
    //       view: renderTexture.createView(),
    //       clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
    //       loadOp: "clear",
    //       storeOp: "store",
    //     },
    //   ],
    // };

    // const commandEncoder = device.createCommandEncoder();
    //
    // const renderPassEncoder = commandEncoder.beginRenderPass(
    //   renderPassDescriptor as GPURenderPassDescriptor
    // );
    //
    // renderPassEncoder.setPipeline(pipeline);
    // renderPassEncoder.setBindGroup(0, bindGroup0);
    // renderPassEncoder.draw(3);
    //
    // renderPassEncoder.end();
    //
    // device.queue.submit([commandEncoder.finish()]);

    this.render = (renderPassEncoder: GPURenderPassEncoder) => {
      renderPassEncoder.setPipeline(pipeline);
      renderPassEncoder.setBindGroup(0, bindGroup0);
      renderPassEncoder.draw(3);
    };
  }
}
