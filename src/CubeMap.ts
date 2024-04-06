import cameraDataShaderString from "../shaders/cameraData.wgsl?raw";
import equirectangularSkyboxShaderString from "../shaders/equirectangularSkybox.wgsl?raw";
import { parseHDR } from "./parseHDR";
import { makeShaderDataDefinitions, makeStructuredView } from "webgpu-utils";
import { mat4, vec3 } from "gl-matrix";

const views: mat4[] = [
  mat4.fromRotation(
    mat4.create(),
    (Math.PI / 180) * 90,
    vec3.fromValues(0, 1, 0)
  ),
  mat4.fromRotation(
    mat4.create(),
    (Math.PI / 180) * -90,
    vec3.fromValues(0, 1, 0)
  ),
  mat4.fromRotation(
    mat4.create(),
    (Math.PI / 180) * -90,
    vec3.fromValues(1, 0, 0)
  ),
  mat4.fromRotation(
    mat4.create(),
    (Math.PI / 180) * 90,
    vec3.fromValues(1, 0, 0)
  ),
  mat4.fromRotation(
    mat4.create(),
    (Math.PI / 180) * 180,
    vec3.fromValues(0, 1, 0)
  ),
  mat4.fromRotation(mat4.create(), 0, vec3.fromValues(0, 1, 0)),
];

export class CubeMap {
  textures: GPUTexture[] = [];

  async init(device: GPUDevice, imageURI: string) {
    const cubeMapFacePixelLength = 2048;

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

    const cameraDataDefs = makeShaderDataDefinitions(cameraDataShaderString);

    const faces = views.map((view) => {
      const cameraData = makeStructuredView(cameraDataDefs.structs.CameraData);
      const cameraDataBuffer = device.createBuffer({
        size: cameraData.arrayBuffer.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });

      let projection = mat4.create();
      mat4.perspectiveZO(projection, (Math.PI / 180) * 90, 1, 0.01, 1000);
      let viewDirectionProjectionInverse = mat4.create();

      mat4.copy(viewDirectionProjectionInverse, view);
      mat4.mul(
        viewDirectionProjectionInverse,
        projection,
        viewDirectionProjectionInverse
      );
      mat4.invert(
        viewDirectionProjectionInverse,
        viewDirectionProjectionInverse
      );

      cameraData.set({
        viewDirectionProjectionInverse,
      });
      device.queue.writeBuffer(cameraDataBuffer, 0, cameraData.arrayBuffer);

      const renderTexture = device.createTexture({
        size: [cubeMapFacePixelLength, cubeMapFacePixelLength],
        format: textureFormat,
        usage:
          GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
      });
      this.textures.push(renderTexture);

      let bindGroup = device.createBindGroup({
        layout: bindGroupLayoutGroup0,
        entries: [
          { binding: 0, resource: equirectangularTextureView },
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

      return { bindGroup, renderPassDescriptor };
    });

    const commandEncoder = device.createCommandEncoder();

    faces.forEach((face) => {
      const renderPassEncoder = commandEncoder.beginRenderPass(
        face.renderPassDescriptor
      );

      renderPassEncoder.setPipeline(pipeline);
      renderPassEncoder.setBindGroup(0, face.bindGroup);
      renderPassEncoder.draw(3);

      renderPassEncoder.end();
    });

    device.queue.submit([commandEncoder.finish()]);
  }
}
