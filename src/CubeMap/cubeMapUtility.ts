import cameraDataShaderString from "../../shaders/cameraData.wgsl?raw";
import equirectangularSkyboxShaderString from "../../shaders/equirectangularSkybox.wgsl?raw";
import calculateIrradianceCubeMapShaderString from "../../shaders/calculateIrradianceCubeMap.wgsl?raw";
import calculatePrefilterCubeMapShaderString from "../../shaders/calculatePrefilterCubeMap.wgsl?raw";
import {
  getCubeMapCameraDataBindGroupLayout,
  getCubeMapCameraDataBindGroups,
} from "./cubeMapCameras";
import { numMipLevels } from "webgpu-utils";

const cubeMapFacePixelLength = 2048;
const irradianceCubeMapFacePixelLength = 32;

export async function equirectangularTextureToCubeMap(
  device: GPUDevice,
  equirectangularTexture: GPUTexture
) {
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

  const cubeMapTexture = device.createTexture({
    size: [cubeMapFacePixelLength, cubeMapFacePixelLength, 6],
    format: textureFormat,
    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
  });

  const commandEncoder = device.createCommandEncoder();

  let bindGroup0 = device.createBindGroup({
    layout: bindGroupLayoutGroup0,
    entries: [
      { binding: 0, resource: equirectangularTexture.createView() },
      { binding: 1, resource: sampler },
    ],
  });
  const cubeMapCameraDataBindGroups = getCubeMapCameraDataBindGroups(device);

  for (let i = 0; i < cubeMapCameraDataBindGroups.length; i++) {
    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: cubeMapTexture.createView({
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

  return cubeMapTexture;
}

export async function cubeMapTextureToIrradianceTexture(
  device: GPUDevice,
  cubeMapTexture: GPUTexture
) {
  const shaderModule = device.createShaderModule({
    code: cameraDataShaderString + calculateIrradianceCubeMapShaderString,
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

  const irradianceCubeMapTexture = device.createTexture({
    size: [
      irradianceCubeMapFacePixelLength,
      irradianceCubeMapFacePixelLength,
      6,
    ],
    format: textureFormat,
    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
  });

  const commandEncoder = device.createCommandEncoder();

  let bindGroup0 = device.createBindGroup({
    layout: bindGroupLayoutGroup0,
    entries: [
      {
        binding: 0,
        resource: cubeMapTexture.createView({ dimension: "cube" }),
      },
      { binding: 1, resource: sampler },
    ],
  });
  const cubeMapCameraDataBindGroups = getCubeMapCameraDataBindGroups(device);

  for (let i = 0; i < cubeMapCameraDataBindGroups.length; i++) {
    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: irradianceCubeMapTexture.createView({
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

  return irradianceCubeMapTexture;
}

export async function cubeMapTextureToPrefilterTexture(
  device: GPUDevice,
  cubeMapTexture: GPUTexture
) {
  const shaderModule = device.createShaderModule({
    code: cameraDataShaderString + calculatePrefilterCubeMapShaderString,
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

  const size = [cubeMapFacePixelLength, cubeMapFacePixelLength, 6];
  const mipLevelCount = numMipLevels(size);
  const prefilterCubeMapTexture = device.createTexture({
    size,
    mipLevelCount,
    format: textureFormat,
    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
  });

  const commandEncoder = device.createCommandEncoder();

  let bindGroup0 = device.createBindGroup({
    layout: bindGroupLayoutGroup0,
    entries: [
      {
        binding: 0,
        resource: cubeMapTexture.createView({ dimension: "cube" }),
      },
      { binding: 1, resource: sampler },
    ],
  });
  const cubeMapCameraDataBindGroups = getCubeMapCameraDataBindGroups(device);

  for (let i = 0; i < cubeMapCameraDataBindGroups.length; i++) {
    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: prefilterCubeMapTexture.createView({
            dimension: "2d",
            baseArrayLayer: i,
            arrayLayerCount: 1,
            baseMipLevel: 0,
            mipLevelCount: 1,
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

  return prefilterCubeMapTexture;
}
