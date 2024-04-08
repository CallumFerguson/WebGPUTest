import cameraDataShaderString from "../../shaders/cameraData.wgsl?raw";
import equirectangularSkyboxShaderString from "../../shaders/equirectangularSkybox.wgsl?raw";
import { parseHDR } from "../parseHDR";
import {
  getCubeMapCameraDataBindGroupLayout,
  getCubeMapCameraDataBindGroups,
} from "./cubeMapCameras";

export class CubeMap {
  cubeMapTexture: GPUTexture | undefined = undefined;
  irradianceCubeMapTexture: GPUTexture | undefined = undefined;

  async init(device: GPUDevice, imageURI: string) {
    const cubeMapFacePixelLength = 2048;

    const hdr = await parseHDR(imageURI);

    const equirectangularTexture = device.createTexture({
      size: { width: hdr.width, height: hdr.height },
      format: "rgba16float",
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });

    device.queue.writeTexture(
      { texture: equirectangularTexture },
      hdr.data.buffer,
      { bytesPerRow: 8 * hdr.width },
      { width: hdr.width, height: hdr.height }
    );

    const equirectangularTextureView = equirectangularTexture.createView();

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
      ],
    });

    const pipelineLayout = device.createPipelineLayout({
      bindGroupLayouts: [
        bindGroupLayoutGroup0,
        getCubeMapCameraDataBindGroupLayout(device),
      ],
    });

    const textureFormat = "rgba16float";

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

    this.cubeMapTexture = device.createTexture({
      size: [cubeMapFacePixelLength, cubeMapFacePixelLength, 6],
      format: textureFormat,
      usage:
        GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });

    // this.irradianceCubeMapTexture = device.createTexture({
    //   size: [cubeMapFacePixelLength, cubeMapFacePixelLength, 6],
    //   format: textureFormat,
    //   usage:
    //     GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    // });

    const commandEncoder = device.createCommandEncoder();

    const cubeMapCameraDataBindGroups = getCubeMapCameraDataBindGroups(device);
    for (let i = 0; i < cubeMapCameraDataBindGroups.length; i++) {
      let bindGroup0 = device.createBindGroup({
        layout: bindGroupLayoutGroup0,
        entries: [
          { binding: 0, resource: equirectangularTextureView },
          { binding: 1, resource: sampler },
        ],
      });

      const renderPassDescriptor: GPURenderPassDescriptor = {
        colorAttachments: [
          {
            view: this.cubeMapTexture!.createView({
              dimension: "2d",
              baseArrayLayer: i,
              arrayLayerCount: 1,
            }),
            clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
            loadOp: "clear",
            storeOp: "store",
          },
        ],
      };

      const renderPassEncoder =
        commandEncoder.beginRenderPass(renderPassDescriptor);

      renderPassEncoder.setPipeline(pipeline);
      renderPassEncoder.setBindGroup(0, bindGroup0);
      renderPassEncoder.setBindGroup(1, cubeMapCameraDataBindGroups[i]);
      renderPassEncoder.draw(3);

      renderPassEncoder.end();
    }

    device.queue.submit([commandEncoder.finish()]);
  }
}
