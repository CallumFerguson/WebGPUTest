import computeBallPhysics from "../shaders/computeBallPhysics.wgsl?raw";
import { BufferBundle } from "./utility";

export class BallComputer {
  compute: (
    computePassEncoder: GPUComputePassEncoder,
    numFixedUpdatesThisFrame: number
  ) => void;

  constructor(
    device: GPUDevice,
    positionBufferBundles: BufferBundle[],
    numObjects: number
  ) {
    const computeShaderModule = device.createShaderModule({
      code: computeBallPhysics,
    });

    const computeBindGroupLayoutRead = device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: "read-only-storage" },
        },
      ],
    });

    const computeBindGroupLayoutWrite = device.createBindGroupLayout({
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
        computeBindGroupLayoutRead,
        computeBindGroupLayoutWrite,
      ],
    });

    const applyVelocityCmputePipeline = device.createComputePipeline({
      layout: computePipelineLayout,
      compute: {
        module: computeShaderModule,
        entryPoint: "applyVelocity",
      },
    });

    const handleCollisionsComputePipeline = device.createComputePipeline({
      layout: computePipelineLayout,
      compute: {
        module: computeShaderModule,
        entryPoint: "handleCollisions",
      },
    });

    positionBufferBundles[0].bindGroups.push(
      device.createBindGroup({
        layout: computeBindGroupLayoutRead,
        entries: [
          { binding: 0, resource: { buffer: positionBufferBundles[0].buffer } },
        ],
      })
    );

    positionBufferBundles[0].bindGroups.push(
      device.createBindGroup({
        layout: computeBindGroupLayoutWrite,
        entries: [
          { binding: 0, resource: { buffer: positionBufferBundles[0].buffer } },
        ],
      })
    );

    positionBufferBundles[1].bindGroups.push(
      device.createBindGroup({
        layout: computeBindGroupLayoutRead,
        entries: [
          { binding: 0, resource: { buffer: positionBufferBundles[1].buffer } },
        ],
      })
    );

    positionBufferBundles[1].bindGroups.push(
      device.createBindGroup({
        layout: computeBindGroupLayoutWrite,
        entries: [
          { binding: 0, resource: { buffer: positionBufferBundles[1].buffer } },
        ],
      })
    );

    function swapBuffers() {
      [positionBufferBundles[0], positionBufferBundles[1]] = [
        positionBufferBundles[1],
        positionBufferBundles[0],
      ];
    }

    function setBindGroups(computePassEncoder: GPUComputePassEncoder) {
      computePassEncoder.setBindGroup(
        0,
        positionBufferBundles[0].bindGroups[1]
      );
      computePassEncoder.setBindGroup(
        1,
        positionBufferBundles[1].bindGroups[2]
      );
    }

    let workgroupCount = numObjects / 64;
    if (!Number.isInteger(workgroupCount)) {
      workgroupCount = Math.ceil(workgroupCount);
      console.log(
        "Until I feel like looking into this, numObjects should probably be a multiple of the workgroup size."
      );
    }

    this.compute = (
      computePassEncoder: GPUComputePassEncoder,
      numFixedUpdatesThisFrame: number
    ) => {
      for (let i = 0; i < numFixedUpdatesThisFrame; i++) {
        computePassEncoder.setPipeline(applyVelocityCmputePipeline);
        setBindGroups(computePassEncoder);
        computePassEncoder.dispatchWorkgroups(workgroupCount);
        swapBuffers();

        computePassEncoder.setPipeline(handleCollisionsComputePipeline);
        setBindGroups(computePassEncoder);
        computePassEncoder.dispatchWorkgroups(workgroupCount);
        swapBuffers();
      }
    };
  }
}
