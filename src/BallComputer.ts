import computeBallPhysicsShaderString from "../shaders/computeBallPhysics.wgsl?raw";
import { Bounds, BufferBundle } from "./utility";
import { makeShaderDataDefinitions, makeStructuredView } from "webgpu-utils";
import { collisionResolveSteps, fixedDeltaTime } from "./constants";

export class BallComputer {
  simulationInfoBuffer: GPUBuffer;

  compute: (
    computePassEncoder: GPUComputePassEncoder,
    numFixedUpdatesThisFrame: number
  ) => void;

  constructor(
    device: GPUDevice,
    positionBufferBundles: BufferBundle[],
    numObjects: number,
    bounds: Bounds
  ) {
    const computeShaderModule = device.createShaderModule({
      code: computeBallPhysicsShaderString,
    });

    const computeBindGroupLayout0 = device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {},
        },
      ],
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
        computeBindGroupLayout0,
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

    const defs = makeShaderDataDefinitions(computeBallPhysicsShaderString);
    const simulationInfo = makeStructuredView(defs.uniforms.simulationInfo);
    this.simulationInfoBuffer = device.createBuffer({
      size: simulationInfo.arrayBuffer.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    let workgroupCount = numObjects / 64;
    if (!Number.isInteger(workgroupCount)) {
      workgroupCount = Math.ceil(workgroupCount);
      console.log(
        "Until I feel like looking into this, numObjects should probably be a multiple of the workgroup size."
      );
    }

    simulationInfo.set({
      fixedDeltaTime,
      workgroupCount,
      boundsSize: bounds.size,
      boundsCenter: bounds.center,
      collisionResolveStepMultiplier: 1 / collisionResolveSteps,
    });
    device.queue.writeBuffer(
      this.simulationInfoBuffer,
      0,
      simulationInfo.arrayBuffer
    );

    const simulationInfoBindGroup = device.createBindGroup({
      layout: computeBindGroupLayout0,
      entries: [
        { binding: 0, resource: { buffer: this.simulationInfoBuffer } },
      ],
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
        1,
        positionBufferBundles[0].bindGroups[1]
      );
      computePassEncoder.setBindGroup(
        2,
        positionBufferBundles[1].bindGroups[2]
      );
    }

    this.compute = (
      computePassEncoder: GPUComputePassEncoder,
      numFixedUpdatesThisFrame: number
    ) => {
      computePassEncoder.setBindGroup(0, simulationInfoBindGroup);

      for (let i = 0; i < numFixedUpdatesThisFrame; i++) {
        computePassEncoder.setPipeline(applyVelocityCmputePipeline);
        setBindGroups(computePassEncoder);
        computePassEncoder.dispatchWorkgroups(workgroupCount);
        swapBuffers();

        for (let n = 0; n < collisionResolveSteps; n++) {
          computePassEncoder.setPipeline(handleCollisionsComputePipeline);
          setBindGroups(computePassEncoder);
          computePassEncoder.dispatchWorkgroups(workgroupCount);
          swapBuffers();
        }
      }
    };
  }
}
