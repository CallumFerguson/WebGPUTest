import computeBallPhysics from "../shaders/computeBallPhysics.wgsl?raw";
import { BufferBundle } from "./utility";

export class BallComputer {
  compute: (computePassEncoder: GPUComputePassEncoder) => void;

  constructor(
    device: GPUDevice,
    positionBufferBundles: BufferBundle[],
    numObjects: number
  ) {
    const computeShaderModule = device.createShaderModule({
      code: computeBallPhysics,
    });

    const computeBindGroupLayoutGroup0 = device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: "storage" },
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
        entryPoint: "main",
      },
    });

    positionBufferBundles[0].bindGroups.push(
      device.createBindGroup({
        layout: computeBindGroupLayoutGroup0,
        entries: [
          { binding: 0, resource: { buffer: positionBufferBundles[0].buffer } },
        ],
      })
    );

    positionBufferBundles[1].bindGroups.push(
      device.createBindGroup({
        layout: computeBindGroupLayoutGroup1,
        entries: [
          { binding: 0, resource: { buffer: positionBufferBundles[1].buffer } },
        ],
      })
    );

    this.compute = (computePassEncoder: GPUComputePassEncoder) => {
      computePassEncoder.setPipeline(computePipeline);
      computePassEncoder.setBindGroup(
        0,
        positionBufferBundles[0].bindGroups[1]
      );
      computePassEncoder.setBindGroup(
        1,
        positionBufferBundles[1].bindGroups[1]
      );

      const computeStepsPerFrame = 1;
      for (let i = 0; i < computeStepsPerFrame; i++) {
        let workgroupCount = numObjects / 64;
        if (!Number.isInteger(workgroupCount)) {
          workgroupCount = Math.ceil(workgroupCount);
          console.log(
            "Until I feel like looking into this, numObjects should probably be a multiple of the workgroup size."
          );
        }
        computePassEncoder.dispatchWorkgroups(workgroupCount);
      }
    };
  }
}
