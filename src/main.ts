import pointParticleShaderString from "../shaders/pointParticle.wgsl?raw";
import computeShaderString from "../shaders/compute.wgsl?raw";
import { makeShaderDataDefinitions, makeStructuredView } from "webgpu-utils";
import { mat4, vec3, quat } from "gl-matrix";
import { getDevice, randomDirection } from "./utility";

async function main() {
  const { gpu, device } = await getDevice();

  const canvas = document.querySelector("canvas") as HTMLCanvasElement;
  if (canvas === null) {
    console.log("no canvas");
    return;
  }
  const context = canvas.getContext("webgpu") as GPUCanvasContext;
  if (context === null) {
    console.log("webgpu context was null");
    return;
  }
  resizeCanvasIfNeeded();

  const presentationFormat = gpu.getPreferredCanvasFormat();
  context.configure({
    device,
    format: presentationFormat,
    alphaMode: "opaque",
  });

  let view = mat4.create();
  let cameraRotation = quat.create();
  let cameraPosition = vec3.fromValues(0, 0, 0);
  mat4.fromRotationTranslation(view, cameraRotation, cameraPosition);
  mat4.invert(view, view);

  let projection = mat4.create();
  function calculateProjection() {
    mat4.perspectiveZO(projection, 90, canvas.width / canvas.height, 0.01, 100);
  }
  calculateProjection();

  const shaderModule = device.createShaderModule({
    code: pointParticleShaderString,
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

  const pipelineLayout = device.createPipelineLayout({
    bindGroupLayouts: [bindGroupLayoutGroup0, bindGroupLayoutGroup1],
  });

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
          format: presentationFormat,
          blend: {
            color: {
              operation: "add",
              srcFactor: "one",
              dstFactor: "one-minus-src-alpha",
            },
            alpha: {
              operation: "add",
              srcFactor: "one",
              dstFactor: "one-minus-src-alpha",
            },
          },
        },
      ],
    },
    primitive: {
      topology: "point-list",
      cullMode: "none",
    },
    multisample: {
      count: 1,
    },
    depthStencil: {
      depthWriteEnabled: false,
      depthCompare: "always",
      format: "depth24plus",
    },
  };
  const pipeline = device.createRenderPipeline(pipelineDescriptor);

  const numObjects = 80000; // 8000000

  const positionsArrayBuffer = new ArrayBuffer(numObjects * 16);
  const positionsArrayBufferView = new Float32Array(positionsArrayBuffer);
  const positionsBuffer = device.createBuffer({
    size: positionsArrayBuffer.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });

  const velocitiesArrayBuffer = new ArrayBuffer(numObjects * 16);
  const velocitiesArrayBufferView = new Float32Array(velocitiesArrayBuffer);
  const velocitiesBuffer = device.createBuffer({
    size: velocitiesArrayBuffer.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });

  const velocity = vec3.create();
  for (let i = 0; i < numObjects; i++) {
    randomDirection(velocity, Math.random() * 0.2 - 0.1);

    positionsArrayBufferView[i * 4 + 2] = -1;

    velocitiesArrayBufferView[i * 4] = velocity[0];
    velocitiesArrayBufferView[i * 4 + 1] = velocity[1];
    velocitiesArrayBufferView[i * 4 + 2] = velocity[2];
  }

  device.queue.writeBuffer(positionsBuffer, 0, positionsArrayBuffer);
  device.queue.writeBuffer(velocitiesBuffer, 0, velocitiesArrayBuffer);

  const defs = makeShaderDataDefinitions(pointParticleShaderString);

  const cameraData = makeStructuredView(defs.uniforms.cameraData);
  const cameraDataBuffer = device.createBuffer({
    size: cameraData.arrayBuffer.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const bindGroup0 = device.createBindGroup({
    layout: bindGroupLayoutGroup0,
    entries: [{ binding: 0, resource: { buffer: cameraDataBuffer } }],
  });

  const bindGroup1 = device.createBindGroup({
    layout: bindGroupLayoutGroup1,
    entries: [{ binding: 0, resource: { buffer: positionsBuffer } }],
  });

  const renderPassDescriptor: unknown = {
    colorAttachments: [
      {
        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
        loadOp: "clear",
        storeOp: "store",
      },
    ],
    depthStencilAttachment: {
      depthClearValue: 1.0,
      depthLoadOp: "clear",
      depthStoreOp: "store",
    },
  };

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

  const computeDefs = makeShaderDataDefinitions(computeShaderString);
  const timeData = makeStructuredView(computeDefs.uniforms.timeData);

  const timeBuffer = device.createBuffer({
    size: timeData.arrayBuffer.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const computeBindGroup0 = device.createBindGroup({
    layout: computeBindGroupLayoutGroup0,
    entries: [{ binding: 0, resource: { buffer: timeBuffer } }],
  });

  const computeBindGroup1 = device.createBindGroup({
    layout: computeBindGroupLayoutGroup1,
    entries: [
      { binding: 0, resource: { buffer: positionsBuffer } },
      { binding: 1, resource: { buffer: velocitiesBuffer } },
    ],
  });

  let depthTexture: GPUTexture | undefined = undefined;
  setUpNewDepthTexture();

  function setUpNewDepthTexture() {
    if (depthTexture) {
      depthTexture.destroy();
    }
    depthTexture = device.createTexture({
      size: [canvas.width, canvas.height],
      format: "depth24plus",
      sampleCount: pipelineDescriptor.multisample
        ? pipelineDescriptor.multisample.count
        : 1,
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });
    // @ts-ignore
    renderPassDescriptor.depthStencilAttachment.view =
      depthTexture.createView();
  }

  let multisampleTexture: GPUTexture | undefined = undefined;
  setUpNewMultisampleTexture();

  function setUpNewMultisampleTexture() {
    if (multisampleTexture) {
      multisampleTexture.destroy();
    }
    if (
      pipelineDescriptor.multisample &&
      pipelineDescriptor.multisample.count !== 1
    ) {
      multisampleTexture = device.createTexture({
        format: presentationFormat,
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
        size: [canvas.width, canvas.height],
        sampleCount: pipelineDescriptor.multisample.count,
      });
      // @ts-ignore
      renderPassDescriptor.colorAttachments[0].view =
        multisampleTexture.createView();
    }
  }

  function resizeCanvasIfNeeded(): boolean {
    const width = Math.max(
      1,
      Math.min(device.limits.maxTextureDimension2D, canvas.clientWidth)
    );
    const height = Math.max(
      1,
      Math.min(device.limits.maxTextureDimension2D, canvas.clientHeight)
    );

    const needResize = width !== canvas.width || height !== canvas.height;
    if (needResize) {
      canvas.width = width;
      canvas.height = height;
    }
    return needResize;
  }

  function handleCanvasResize() {
    const resized = resizeCanvasIfNeeded();
    if (!resized) {
      return;
    }

    calculateProjection();
    setUpNewMultisampleTexture();
    setUpNewDepthTexture();
  }

  let previousTime = 0;
  async function render(currentTime: number) {
    currentTime *= 0.001;
    const deltaTime = currentTime - previousTime;

    timeData.set({
      deltaTime,
    });
    device.queue.writeBuffer(timeBuffer, 0, timeData.arrayBuffer);

    // console.log(1 / deltaTime);

    handleCanvasResize();

    if (
      pipelineDescriptor.multisample &&
      pipelineDescriptor.multisample.count !== 1
    ) {
      // @ts-ignore
      renderPassDescriptor.colorAttachments[0].resolveTarget = context
        .getCurrentTexture()
        .createView();
    } else {
      // @ts-ignore
      renderPassDescriptor.colorAttachments[0].view = context
        .getCurrentTexture()
        .createView();
    }

    let viewProjection = mat4.create();
    mat4.mul(viewProjection, projection, view);

    cameraData.set({
      view: view,
      projection: projection,
    });
    device.queue.writeBuffer(cameraDataBuffer, 0, cameraData.arrayBuffer);

    // for (let i = 0; i < objectInfos.length; i++) {
    //   const objectInfo = objectInfos[i];
    //
    //   const step = vec3.create();
    //   vec3.copy(step, objectInfo.velocity);
    //   vec3.scale(step, step, deltaTime / size);
    //   mat4.translate(objectInfo.model, objectInfo.model, step);
    //
    //   // if (i === 0) {
    //   //   console.log(objectInfo.model);
    //   // }
    //
    //   // mat4.rotate(
    //   //   objectInfo.model,
    //   //   objectInfo.model,
    //   //   vec3.length(objectInfo.angularVelocity) * deltaTime,
    //   //   objectInfo.angularVelocity
    //   // );
    // }
    //
    // uniformData.set(
    //   objectInfos.map((objectInfo) => {
    //     return { model: objectInfo.model };
    //   })
    // );

    // device.queue.writeBuffer(storageBuffer, 0, uniformData.arrayBuffer);

    const commandEncoder = device.createCommandEncoder();

    const passEncoder = commandEncoder.beginRenderPass(
      renderPassDescriptor as GPURenderPassDescriptor
    );

    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup0);
    passEncoder.setBindGroup(1, bindGroup1);

    // quat.rotateY(
    //   renderableObject.rotation,
    //   renderableObject.rotation,
    //   Math.PI * deltaTime
    // );
    // renderableObject.position[1] = Math.sin(currentTime * 1.5) / 2 - 0.4;

    // renderableObject.uniformDataValues.set({
    //   mvp: renderableObject.mvp(view, projection),
    //   model: renderableObject.model(),
    // });
    // device.queue.writeBuffer(
    //   renderableObject.uniformBuffer,
    //   0,
    //   renderableObject.uniformDataValues.arrayBuffer
    // );

    // passEncoder.drawIndexed(indices.length, numObjects);
    passEncoder.draw(numObjects);

    passEncoder.end();

    const computePassEncoder = commandEncoder.beginComputePass();

    computePassEncoder.setPipeline(computePipeline);
    computePassEncoder.setBindGroup(0, computeBindGroup0);
    computePassEncoder.setBindGroup(1, computeBindGroup1);
    computePassEncoder.dispatchWorkgroups(numObjects / 128);
    computePassEncoder.end();

    // commandEncoder.copyBufferToBuffer(
    //   storageBuffer,
    //   0,
    //   storageResultBuffer,
    //   0,
    //   storageResultBuffer.size
    // );

    device.queue.submit([commandEncoder.finish()]);

    // await storageResultBuffer.mapAsync(GPUMapMode.READ);
    // const result = new Float32Array(storageResultBuffer.getMappedRange());
    // console.log(result.slice(0, 16));
    // storageResultBuffer.unmap();

    previousTime = currentTime;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

window.onload = () => {
  main().then();
};
