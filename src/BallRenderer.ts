import pbrBallShaderString from "../shaders/PBRBall.wgsl?raw";
import cameraDataShaderString from "../shaders/cameraData.wgsl?raw";
import { BufferBundle, createBuffer, loadModel, shuffleArray } from "./utility";
import { multisampleCount } from "./constants";
import { CubeMap } from "./CubeMap/CubeMap";
import { calculateBRDFTexture } from "./calculateBRDFTexture";

export class BallRenderer {
  positionBufferBundles: BufferBundle[] = [];

  render: (renderPassEncoder: GPURenderPassEncoder) => void = () => {};
  fixedUpdate: (fixedDeltaTime: number) => void = () => {};

  async init(
    device: GPUDevice,
    presentationFormat: GPUTextureFormat,
    cameraDataBuffer: GPUBuffer,
    numObjects: number,
    environmentCubeMap: CubeMap
  ) {
    let bodyInfoArrayBuffer = new ArrayBuffer(numObjects * 16 * 4);
    let bodyInfoArrayBufferView = new Float32Array(bodyInfoArrayBuffer);

    // const sideLength = Math.ceil(Math.cbrt(numObjects));
    const sideLength = 10;
    const height = Math.ceil(numObjects / (sideLength * sideLength));
    const spacing = 1.5;
    const startPositions = [];
    for (let z = sideLength - 1; z >= 0; z--) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < sideLength; x++) {
          if (startPositions.length == numObjects) {
            break;
          }
          startPositions.push([
            x * spacing - (sideLength * spacing) / 2 + Math.random() * 0.01,
            y * spacing + 0 + Math.random() * 0.01,
            z * spacing - (sideLength * spacing) / 2 + Math.random() * 0.01,
          ]);
        }
      }
    }
    shuffleArray(startPositions);

    for (let i = 0; i < numObjects; i++) {
      // position
      bodyInfoArrayBufferView[i * 16] = startPositions[i][0];
      bodyInfoArrayBufferView[i * 16 + 1] = startPositions[i][1];
      bodyInfoArrayBufferView[i * 16 + 2] = startPositions[i][2];

      // velocity
      // bodyInfoArrayBufferView[i * 16 + 4] = Math.random() - 0.5;
      // bodyInfoArrayBufferView[i * 16 + 4 + 1] = Math.random() - 0.5;
      // bodyInfoArrayBufferView[i * 16 + 4 + 2] = Math.random() - 0.5;
      bodyInfoArrayBufferView[i * 16 + 4 + 1] = -10;

      // color
      bodyInfoArrayBufferView[i * 16 + 8] = Math.random() * 0.8 + 0.2;
      bodyInfoArrayBufferView[i * 16 + 8 + 1] = Math.random() * 0.8 + 0.2;
      bodyInfoArrayBufferView[i * 16 + 8 + 2] = Math.random() * 0.8 + 0.2;

      // radius
      const radius = 0.5 + Math.random();
      bodyInfoArrayBufferView[i * 16 + 3] = radius; // 0.12 for basketball sized sphere

      // restitution
      bodyInfoArrayBufferView[i * 16 + 7] = 0;

      // mass
      bodyInfoArrayBufferView[i * 16 + 11] =
        (4 / 3) * Math.PI * (radius * radius * radius); // mass is just volume

      // metallic
      bodyInfoArrayBufferView[i * 16 + 12] = Math.random();

      // roughness
      bodyInfoArrayBufferView[i * 16 + 13] = Math.random();
    }

    // bodyInfoArrayBufferView[0] = 0;
    // bodyInfoArrayBufferView[1] = 0;
    // bodyInfoArrayBufferView[2] = 0;
    //
    // bodyInfoArrayBufferView[8] = 0.1;
    // bodyInfoArrayBufferView[8 + 1] = 2;
    // bodyInfoArrayBufferView[8 + 2] = 0;
    //
    // bodyInfoArrayBufferView[8 + 4 + 1] = -2;

    const shaderModule = device.createShaderModule({
      code: cameraDataShaderString + pbrBallShaderString,
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
          texture: { viewDimension: "cube" },
        },
        {
          binding: 2,
          visibility: GPUShaderStage.FRAGMENT,
          texture: { viewDimension: "cube" },
        },
        {
          binding: 3,
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

    for (let i = 0; i < 2; i++) {
      const buffer = device.createBuffer({
        size: bodyInfoArrayBuffer.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      });
      const bindGroup = device.createBindGroup({
        layout: bindGroupLayoutGroup2,
        entries: [{ binding: 0, resource: { buffer } }],
      });
      this.positionBufferBundles.push({
        buffer,
        bindGroups: [bindGroup],
      });
    }
    device.queue.writeBuffer(
      this.positionBufferBundles[0].buffer,
      0,
      bodyInfoArrayBuffer
    );

    const pipelineLayout = device.createPipelineLayout({
      bindGroupLayouts: [
        bindGroupLayoutGroup0,
        bindGroupLayoutGroup1,
        bindGroupLayoutGroup2,
      ],
    });

    const { vertices, indices, uvs, normals, tangents, bitangents } =
      await loadModel("sphere.glb");

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

    const bindGroup0 = device.createBindGroup({
      layout: bindGroupLayoutGroup0,
      entries: [{ binding: 0, resource: { buffer: cameraDataBuffer } }],
    });

    let brdfLUT = calculateBRDFTexture(device);

    let bindGroup1 = device.createBindGroup({
      layout: bindGroupLayoutGroup1,
      entries: [
        { binding: 0, resource: sampler },
        {
          binding: 1,
          resource: environmentCubeMap.irradianceCubeMapTexture!.createView({
            dimension: "cube",
          }),
        },
        {
          binding: 2,
          resource: environmentCubeMap.prefilterCubeMapTexture!.createView({
            dimension: "cube",
          }),
        },
        { binding: 3, resource: brdfLUT.createView() },
      ],
    });

    this.render = (renderPassEncoder: GPURenderPassEncoder) => {
      renderPassEncoder.setPipeline(pipeline);

      renderPassEncoder.setBindGroup(0, bindGroup0);
      renderPassEncoder.setBindGroup(1, bindGroup1);
      renderPassEncoder.setBindGroup(
        2,
        this.positionBufferBundles[0].bindGroups[0]
      );

      renderPassEncoder.setVertexBuffer(0, vertexBuffer);
      renderPassEncoder.setVertexBuffer(1, normalBuffer);
      renderPassEncoder.setVertexBuffer(2, uvBuffer);
      renderPassEncoder.setVertexBuffer(3, tangentBuffer);
      renderPassEncoder.setVertexBuffer(4, bitangentBuffer);

      renderPassEncoder.setIndexBuffer(indexBuffer, "uint32");

      renderPassEncoder.drawIndexed(indices.length, numObjects);
    };
  }
}
