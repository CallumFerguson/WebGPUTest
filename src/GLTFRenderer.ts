import pbrShaderString from "../shaders/PBR.wgsl?raw";
import cameraDataShaderString from "../shaders/cameraData.wgsl?raw";
import {
  createTextureFromImage,
  createTextureFromImages,
  makeShaderDataDefinitions,
  makeStructuredView,
} from "webgpu-utils";
import {
  calculateNormals,
  calculateTangents,
  createBuffer,
  loadModel,
} from "./utility";
import { multisampleCount } from "./constants";
import { mat4, vec3 } from "gl-matrix";

const shaderString: string = cameraDataShaderString + pbrShaderString;

export class GLTFRenderer {
  render: ((renderPassEncoder: GPURenderPassEncoder) => void) | undefined =
    undefined;

  async init(
    modelName: string,
    device: GPUDevice,
    presentationFormat: GPUTextureFormat,
    cameraDataBuffer: GPUBuffer
  ) {
    const environmentCubeMapTexture = await createTextureFromImages(
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

    const defs = makeShaderDataDefinitions(shaderString);
    const objectData = makeStructuredView(defs.uniforms.objectData);
    const objectDataBuffer = device.createBuffer({
      size: objectData.arrayBuffer.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const model = mat4.create();
    const scale = 100;
    mat4.fromScaling(model, vec3.fromValues(scale, scale, scale));
    objectData.set({
      model: model,
    });
    device.queue.writeBuffer(objectDataBuffer, 0, objectData.arrayBuffer);

    let { vertices, indices, uvs, normals, tangents, bitangents, textureURIs } =
      await loadModel(modelName);

    if (!uvs) {
      console.log("model missing texurecoords");
    }

    if (!normals) {
      console.log("model missing normals. calculating new normals.");
      normals = calculateNormals(vertices, indices);
    }

    if (!tangents || !bitangents) {
      if (uvs) {
        console.log(
          "model missing tangents or bitangents. calculating new tangents"
        );
        ({ tangents, bitangents } = calculateTangents(vertices, indices, uvs));
      } else {
        console.log(
          "model missing tangents or bitangents, but new tangents cannot be calculated because the model is also missing uvs"
        );
      }
    }

    let textures = await Promise.all(
      textureURIs.map((textureURI) => {
        return createTextureFromImage(device, textureURI, {
          mips: true,
          flipY: true,
        });
      })
    );

    const vertexBuffer = createBuffer(device, vertices, GPUBufferUsage.VERTEX);
    const indexBuffer = createBuffer(device, indices, GPUBufferUsage.INDEX);

    const uvBuffer = createBuffer(device, uvs, GPUBufferUsage.VERTEX);
    const normalBuffer = createBuffer(device, normals, GPUBufferUsage.VERTEX);
    const tangentBuffer = createBuffer(device, tangents, GPUBufferUsage.VERTEX);
    const bitangentBuffer = createBuffer(
      device,
      bitangents,
      GPUBufferUsage.VERTEX
    );

    const shaderModule = device.createShaderModule({
      code: shaderString,
    });

    const bindGroupLayoutGroup0 = device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          buffer: {},
        },
      ],
    });

    const bindGroupLayoutGroup1 = device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          sampler: {},
        },
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          texture: {},
        },
        {
          binding: 2,
          visibility: GPUShaderStage.FRAGMENT,
          texture: {},
        },
        {
          binding: 3,
          visibility: GPUShaderStage.FRAGMENT,
          texture: {},
        },
        {
          binding: 4,
          visibility: GPUShaderStage.FRAGMENT,
          texture: {},
        },
        {
          binding: 5,
          visibility: GPUShaderStage.FRAGMENT,
          texture: { viewDimension: "cube" },
        },
      ],
    });

    const bindGroupLayoutGroup2 = device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {},
        },
      ],
    });

    const pipelineLayout = device.createPipelineLayout({
      bindGroupLayouts: [
        bindGroupLayoutGroup0,
        bindGroupLayoutGroup1,
        bindGroupLayoutGroup2,
      ],
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
          {
            arrayStride: 3 * 4,
            attributes: [{ shaderLocation: 1, offset: 0, format: "float32x3" }],
          },
          {
            arrayStride: 2 * 4,
            attributes: [{ shaderLocation: 2, offset: 0, format: "float32x2" }],
          },
          {
            arrayStride: 3 * 4,
            attributes: [{ shaderLocation: 3, offset: 0, format: "float32x3" }],
          },
          {
            arrayStride: 3 * 4,
            attributes: [{ shaderLocation: 4, offset: 0, format: "float32x3" }],
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
      entries: [{ binding: 0, resource: { buffer: cameraDataBuffer } }],
    });

    let bindGroup1 = device.createBindGroup({
      layout: bindGroupLayoutGroup1,
      entries: [
        { binding: 0, resource: sampler },
        { binding: 1, resource: textures[0].createView() },
        { binding: 2, resource: textures[3].createView() },
        { binding: 3, resource: textures[2].createView() },
        { binding: 4, resource: textures[1].createView() },
        {
          binding: 5,
          resource: environmentCubeMapTexture.createView({ dimension: "cube" }),
        },
      ],
    });

    let bindGroup2 = device.createBindGroup({
      layout: bindGroupLayoutGroup2,
      entries: [{ binding: 0, resource: { buffer: objectDataBuffer } }],
    });

    this.render = (renderPassEncoder: GPURenderPassEncoder) => {
      renderPassEncoder.setPipeline(pipeline);
      renderPassEncoder.setBindGroup(0, bindGroup0);
      renderPassEncoder.setBindGroup(1, bindGroup1);
      renderPassEncoder.setBindGroup(2, bindGroup2);
      renderPassEncoder.setVertexBuffer(0, vertexBuffer);
      renderPassEncoder.setVertexBuffer(1, normalBuffer);
      renderPassEncoder.setVertexBuffer(2, uvBuffer);
      renderPassEncoder.setVertexBuffer(3, tangentBuffer);
      renderPassEncoder.setVertexBuffer(4, bitangentBuffer);
      renderPassEncoder.setIndexBuffer(indexBuffer, "uint32");
      renderPassEncoder.drawIndexed(indices.length);
    };
  }
}
