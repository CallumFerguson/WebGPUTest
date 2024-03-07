import computeShaderString from "../shaders/compute.wgsl?raw";

export class ParticleComputer {
  positionsBuffer: GPUBuffer;
  render: (computePassEncoder: GPUComputePassEncoder) => void;

  constructor(
    device: GPUDevice,
    positionsBuffer: GPUBuffer,
    timeBuffer: GPUBuffer,
    numObjects: number
  ) {
    this.positionsBuffer = positionsBuffer;

    const velocitiesArrayBuffer = new ArrayBuffer(numObjects * 16);
    const velocitiesArrayBufferView = new Float32Array(velocitiesArrayBuffer);
    const velocitiesBuffer = device.createBuffer({
      size: velocitiesArrayBuffer.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    // const velocity = vec3.create();
    for (let i = 0; i < numObjects; i++) {
      // randomDirection(velocity, Math.random() * 0.25);

      velocitiesArrayBufferView[i * 4] = (1.5 + Math.random() * 1.4 - 0.7) * 2;
      velocitiesArrayBufferView[i * 4 + 1] = (Math.random() * 0.4 - 0.2) * 2;
      velocitiesArrayBufferView[i * 4 + 2] = 0;
    }
    device.queue.writeBuffer(velocitiesBuffer, 0, velocitiesArrayBuffer);

    const computeShaderModule = device.createShaderModule({
      code: computeShaderString,
    });

    const computeBindGroupLayoutGroup0 = device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {},
        },
      ],
    });

    const computeBindGroupLayoutGroup1 = device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: "storage" },
        },
        {
          binding: 1,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: "storage" },
        },
      ],
    });

    const computePipelineLayout = device.createPipelineLayout({
      bindGroupLayouts: [
        computeBindGroupLayoutGroup0,
        computeBindGroupLayoutGroup1,
      ],
    });

    const computePipeline = device.createComputePipeline({
      layout: computePipelineLayout,
      compute: {
        module: computeShaderModule,
        entryPoint: "computeSomething",
      },
    });

    const computeBindGroup0 = device.createBindGroup({
      layout: computeBindGroupLayoutGroup0,
      entries: [{ binding: 0, resource: { buffer: timeBuffer } }],
    });

    const computeBindGroup1 = device.createBindGroup({
      layout: computeBindGroupLayoutGroup1,
      entries: [
        { binding: 0, resource: { buffer: this.positionsBuffer } },
        { binding: 1, resource: { buffer: velocitiesBuffer } },
      ],
    });

    this.render = (computePassEncoder: GPUComputePassEncoder) => {
      computePassEncoder.setPipeline(computePipeline);
      computePassEncoder.setBindGroup(0, computeBindGroup0);
      computePassEncoder.setBindGroup(1, computeBindGroup1);
      computePassEncoder.dispatchWorkgroups(numObjects / 128);
    };
  }
}
