import pbrShaderString from "../shaders/PBR.wgsl?raw";
import cameraDataShaderString from "../shaders/cameraData.wgsl?raw";
import {
  createTextureFromImage,
  makeShaderDataDefinitions,
  makeStructuredView,
} from "webgpu-utils";
import {
  calculateNormals,
  calculateTangents,
  clamp,
  createBuffer,
  DegToRad,
  loadModel,
} from "./utility";
import { multisampleCount } from "./constants";
import { mat4, quat, vec3 } from "gl-matrix";
import { CubeMap } from "./CubeMap/CubeMap";
import { calculateBRDFTexture } from "./calculateBRDFTexture";

const shaderString: string = cameraDataShaderString + pbrShaderString;

export class GLTFRenderer {
  render: ((renderPassEncoder: GPURenderPassEncoder) => void) | undefined =
    undefined;

  async init(
    modelName: string,
    device: GPUDevice,
    presentationFormat: GPUTextureFormat,
    cameraDataBuffer: GPUBuffer,
    environmentCubeMap: CubeMap
  ) {
    const nrRows = 1;
    const nrColumns = 1;
    const spacing = 2.5;

    const objectDataArray: {
      model: mat4;
      normalMatrix: mat4;
      metallic: number;
      roughness: number;
    }[] = [];
    for (let row = 0; row < nrRows; row++) {
      const metallic = row / nrRows;
      for (let col = 0; col < nrColumns; col++) {
        // we clamp the roughness to 0.05 - 1.0 as perfectly smooth surfaces (roughness of 0.0) tend to look a bit off
        // on direct lighting.
        const roughness = clamp(col / nrColumns, 0.05, 1);

        const scale = 500;
        const model = mat4.create();
        const rotation = quat.create();
        quat.rotateY(rotation, rotation, DegToRad * 180);
        mat4.fromRotationTranslationScale(
          model,
          rotation,
          vec3.fromValues(
            (col - nrColumns / 2) * spacing + spacing / 2,
            (row - nrRows / 2) * spacing + spacing / 2,
            0
          ),
          vec3.fromValues(scale, scale, scale)
        );

        const normalMatrix = mat4.create();
        mat4.invert(normalMatrix, model);
        mat4.transpose(normalMatrix, normalMatrix);

        objectDataArray.push({
          model,
          normalMatrix,
          metallic,
          roughness,
        });
      }
    }

    const defs = makeShaderDataDefinitions(shaderString);
    const objectData = makeStructuredView(
      defs.storages.objectData,
      new ArrayBuffer(defs.structs.ObjectData.size * nrRows * nrColumns)
    );
    const objectDataBuffer = device.createBuffer({
      size: objectData.arrayBuffer.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    objectData.set(objectDataArray);
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

    // TODO: default textures for when they are missing (white albedo, flat normals, white AO, etc.)
    if (textureURIs.length !== 4) {
      textureURIs = ["normal.png", "normal.png", "normal.png", "normal.png"];
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
        {
          binding: 6,
          visibility: GPUShaderStage.FRAGMENT,
          texture: { viewDimension: "cube" },
        },
        {
          binding: 7,
          visibility: GPUShaderStage.FRAGMENT,
          texture: {},
        },
      ],
    });

    const bindGroupLayoutGroup2 = device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: { type: "read-only-storage" },
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
      mipmapFilter: "linear",
    });

    let bindGroup0 = device.createBindGroup({
      layout: bindGroupLayoutGroup0,
      entries: [{ binding: 0, resource: { buffer: cameraDataBuffer } }],
    });

    let brdfLUT = calculateBRDFTexture(device);

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
          resource: environmentCubeMap.irradianceCubeMapTexture!.createView({
            dimension: "cube",
          }),
        },
        {
          binding: 6,
          resource: environmentCubeMap.prefilterCubeMapTexture!.createView({
            dimension: "cube",
          }),
        },
        { binding: 7, resource: brdfLUT.createView() },
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

      renderPassEncoder.drawIndexed(indices.length, nrRows * nrColumns);
    };
  }
}
