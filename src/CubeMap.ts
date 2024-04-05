import cameraDataShaderString from "../shaders/cameraData.wgsl?raw";
import equirectangularSkyboxShaderString from "../shaders/equirectangularSkybox.wgsl?raw";
import { parseHDR } from "./parseHDR";

export class CubeMap {
  texture: GPUTexture | undefined;

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
            format: textureFormat,
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

    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: renderTexture.createView(),
          clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
          loadOp: "clear",
          storeOp: "store",
        },
      ],
    };

    // const gpuReadBuffer = device.createBuffer({
    //   size: 512 * 512 * 4,
    //   usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    // });

    const commandEncoder = device.createCommandEncoder();

    const renderPassEncoder = commandEncoder.beginRenderPass(
      renderPassDescriptor as GPURenderPassDescriptor
    );

    renderPassEncoder.setPipeline(pipeline);
    renderPassEncoder.setBindGroup(0, bindGroup0);
    renderPassEncoder.draw(3);

    renderPassEncoder.end();

    // commandEncoder.copyTextureToBuffer(
    //   { texture: renderTexture },
    //   { buffer: gpuReadBuffer, bytesPerRow: 512 * 4 },
    //   [512, 512]
    // );

    device.queue.submit([commandEncoder.finish()]);

    // await gpuReadBuffer.mapAsync(GPUMapMode.READ);
    //
    // const data = new Uint8Array(gpuReadBuffer.getMappedRange());
    //
    // // const image = await new Jimp({
    // //   width: 512,
    // //   height: 512,
    // //   data,
    // // });
    //
    // return;
    //
    // const pngBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
    //
    // const blob = new Blob([pngBuffer], { type: "image/png" });
    // const url = URL.createObjectURL(blob);
    //
    // // Create a link and download the PNG
    // const link = document.createElement("a");
    // link.href = url;
    // link.download = "renderedTexture.png";
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    //
    // // Cleanup
    // gpuReadBuffer.unmap();
  }
}
