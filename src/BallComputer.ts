import computeBallPhysicsShaderString from "../shaders/computeBallPhysics.wgsl?raw";
import { Bounds, BufferBundle } from "./utility";
import { makeShaderDataDefinitions, makeStructuredView } from "webgpu-utils";
import { collisionResolveSteps, fixedDeltaTime } from "./constants";
import { mat4 } from "gl-matrix";

export class BallComputer {
  simulationInfoBuffer: GPUBuffer;
  updateBounds: () => void;

  compute: (
    computePassEncoder: GPUComputePassEncoder,
    numFixedUpdatesThisFrame: number,
    currentTime: number
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
      collisionResolveStepMultiplier: 1 / collisionResolveSteps,
    });

    const simulationInfoBuffer = this.simulationInfoBuffer;
    this.updateBounds = () => {
      const rotationInverse = mat4.create();
      mat4.invert(rotationInverse, bounds.rotation);
      simulationInfo.set({
        boundsSize: bounds.size,
        boundsCenter: bounds.center,
        boundsRotation: bounds.rotation,
        boundsRotationInverse: rotationInverse,
      });
      device.queue.writeBuffer(
        simulationInfoBuffer,
        0,
        simulationInfo.arrayBuffer
      );
    };
    this.updateBounds();

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

      // mat4.rotateX(
      //   bounds.rotation,
      //   bounds.rotation,
      //   (Math.PI / 180) * -20 * fixedDeltaTime
      // );
      const rotateBy = mat4.create();
      mat4.rotateZ(rotateBy, rotateBy, (Math.PI / 180) * -20 * fixedDeltaTime);
      mat4.mul(bounds.rotation, rotateBy, bounds.rotation);
      //
      // bounds.center[0] = Math.cos(currentTime * 0.25) * 50;
      // bounds.center[1] = Math.sin(currentTime * 0.25) * 50;

      this.updateBounds();

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
