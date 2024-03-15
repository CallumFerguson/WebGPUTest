import ballShaderString from "../shaders/ball.wgsl?raw";
import { BufferBundle, createBuffer, loadModel, shuffleArray } from "./utility";

// const ballRadius = 0.12;

export class BallRenderer {
  positionBufferBundles: BufferBundle[] = [];

  render: (renderPassEncoder: GPURenderPassEncoder) => void = () => {};
  fixedUpdate: (fixedDeltaTime: number) => void = () => {};

  async init(
    device: GPUDevice,
    presentationFormat: GPUTextureFormat,
    cameraDataBuffer: GPUBuffer,
    numObjects: number
  ) {
    let bodyInfoArrayBuffer = new ArrayBuffer(numObjects * 16 * 3);
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
            y * spacing + 10 + Math.random() * 0.01,
            z * spacing - (sideLength * spacing) / 2 + Math.random() * 0.01,
          ]);
        }
      }
    }
    shuffleArray(startPositions);

    for (let i = 0; i < numObjects; i++) {
      // position
      bodyInfoArrayBufferView[i * 12] = startPositions[i][0];
      bodyInfoArrayBufferView[i * 12 + 1] = startPositions[i][1];
      bodyInfoArrayBufferView[i * 12 + 2] = startPositions[i][2];

      // velocity
      // bodyInfoArrayBufferView[i * 12 + 4] = Math.random() - 0.5;
      // bodyInfoArrayBufferView[i * 12 + 4 + 1] = Math.random() - 0.5;
      // bodyInfoArrayBufferView[i * 12 + 4 + 2] = Math.random() - 0.5;

      // color
      bodyInfoArrayBufferView[i * 12 + 8] = Math.random() * 0.8 + 0.2;
      bodyInfoArrayBufferView[i * 12 + 8 + 1] = Math.random() * 0.8 + 0.2;
      bodyInfoArrayBufferView[i * 12 + 8 + 2] = Math.random() * 0.8 + 0.2;

      // radius
      const radius = 0.1 + Math.random();
      bodyInfoArrayBufferView[i * 12 + 3] = radius; // 0.12 for basketball sized sphere

      // restitution
      bodyInfoArrayBufferView[i * 12 + 7] = 0;

      // mass
      bodyInfoArrayBufferView[i * 12 + 11] =
        (4 / 3) * Math.PI * (radius * radius * radius); // mass is just volume
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
      code: ballShaderString,
    });

    const bindGroupLayoutGroup0 = device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {},
        },
      ],
    });

    const bindGroupLayoutGroup1 = device.createBindGroupLayout({
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
        layout: bindGroupLayoutGroup1,
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
      bindGroupLayouts: [bindGroupLayoutGroup0, bindGroupLayoutGroup1],
    });

    const { vertices, indices, normals } = await loadModel("sphere.glb");

    const vertexBuffer = createBuffer(device, vertices, GPUBufferUsage.VERTEX);
    const normalBuffer = createBuffer(device, normals, GPUBufferUsage.VERTEX);
    const indexBuffer = createBuffer(device, indices, GPUBufferUsage.INDEX);

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
        count: 1,
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less",
        format: "depth24plus",
      },
    };
    const pipeline = device.createRenderPipeline(pipelineDescriptor);

    const bindGroup0 = device.createBindGroup({
      layout: bindGroupLayoutGroup0,
      entries: [{ binding: 0, resource: { buffer: cameraDataBuffer } }],
    });

    this.render = (renderPassEncoder: GPURenderPassEncoder) => {
      renderPassEncoder.setPipeline(pipeline);

      renderPassEncoder.setBindGroup(0, bindGroup0);
      renderPassEncoder.setBindGroup(
        1,
        this.positionBufferBundles[0].bindGroups[0]
      );

      renderPassEncoder.setVertexBuffer(0, vertexBuffer);
      renderPassEncoder.setVertexBuffer(1, normalBuffer);

      renderPassEncoder.setIndexBuffer(indexBuffer, "uint32");

      renderPassEncoder.drawIndexed(indices.length, numObjects);
    };
  }
}
