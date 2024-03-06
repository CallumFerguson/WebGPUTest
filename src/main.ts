import simpleLitShaderString from "../shaders/simple_lit.wgsl?raw";
import computeShaderString from "../shaders/compute.wgsl?raw";
import {
  makeShaderDataDefinitions,
  makeStructuredView,
  createTextureFromImage,
} from "webgpu-utils";
import { mat4, vec3, quat } from "gl-matrix";
import { createBuffer, getDevice, randomDirection } from "./utility";

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

  // let { vertices, normals, uvs, textureURI, indices } = await loadModel(
  //   "duck.glb"
  // );

  const vertices = new Float32Array([
    -0.5, 0.5, 0, 0.5, 0.5, 0, 0.5, -0.5, 0, -0.5, -0.5, 0,
  ]);
  const normals = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const uvs = new Float32Array([0, 1, 1, 1, 1, 0, 0, 0]);
  const indices = new Uint32Array([0, 2, 1, 0, 3, 2]);
  const textureURI = `data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGQSURBVDhPjdTbK0RRGIbxmWGcJYecEnGDG0ION25J/lx3bpQkRTnkEuUQkkyEGQbjeaa1hpmi+eo3mz17vXvttb81yURFFQoFD41oRgNS+EQWr8glk+XDSv+FwQ7qwhBG0I065HCNM1wgg/cYVvwMAU0YxkIwjh4Y4iwMOcY2dnGFN4NiSD0H77yMVUyiHTXwGu/ygTsYsIYNXBGST4VZdGAWK5iHj1SL+Lge0+jHIrxuAq2Od9GcxQDmwhctiIMry/PecBoz8HHThriYgxiFF/wVEMvvHTyGPhRDXDgH+yaccjVlC3i961ZriMk+f7UBVhxTHO+HjWQTPeML1ZRv6gVv+DLEP25gE9lU1dQTzuErz8cQTxziEs7sv8rDzj2CDZgzxJO32MEW7ESnW1k21DtOsYk93P/uWA+9sNGWYNu7f+wZu9bQRxjgjdaxj4dSiBWCfG32yxTcO/ZB3DvO0L1zgBNkyjZgrBDkT0AnbKg2OBMf+QEupDs4GwOsspBYIcwZxP3jq3fBS9v/pxKJb3rLcyrfzUZyAAAAAElFTkSuQmCC`;

  const vertexBuffer = createBuffer(device, vertices, GPUBufferUsage.VERTEX);
  const normalBuffer = createBuffer(device, normals, GPUBufferUsage.VERTEX);
  const uvBuffer = createBuffer(device, uvs, GPUBufferUsage.VERTEX);
  const indexBuffer = createBuffer(device, indices, GPUBufferUsage.INDEX);

  const texture = await createTextureFromImage(device, textureURI, {
    mips: true,
    flipY: true,
  });

  const sampler = device.createSampler({
    magFilter: "linear",
    minFilter: "linear",
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
    code: simpleLitShaderString,
  });

  const bindGroupLayoutGroup0 = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.VERTEX,
        buffer: {},
      },
      {
        binding: 1,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {},
      },
      {
        binding: 2,
        visibility: GPUShaderStage.FRAGMENT,
        sampler: {},
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
      buffers: [
        // vertex
        {
          arrayStride: 3 * 4,
          attributes: [{ shaderLocation: 0, offset: 0, format: "float32x3" }],
        },
        // normal
        {
          arrayStride: 3 * 4,
          attributes: [{ shaderLocation: 1, offset: 0, format: "float32x3" }],
        },
        // uv
        {
          arrayStride: 2 * 4,
          attributes: [{ shaderLocation: 2, offset: 0, format: "float32x2" }],
        },
      ],
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
      topology: "triangle-list",
      cullMode: "none",
    },
    multisample: {
      count: 4,
    },
    depthStencil: {
      depthWriteEnabled: false,
      depthCompare: "always",
      format: "depth24plus",
    },
  };
  const pipeline = device.createRenderPipeline(pipelineDescriptor);

  const numObjects = 4000000;
  const objectInfos: {
    position: vec3;
    velocity: vec3;
  }[] = [];
  for (let i = 0; i < numObjects; i++) {
    objectInfos.push({
      position: vec3.fromValues(0, 0, -1),
      velocity: randomDirection(Math.random() * 0.2 - 0.1),
    });
  }

  const defs = makeShaderDataDefinitions(simpleLitShaderString);

  const uniformDataByteLength = // @ts-ignore
    defs.storages.uniformData.typeDefinition.elementType.size;
  const uniformData = makeStructuredView(
    defs.storages.uniformData,
    new ArrayBuffer(uniformDataByteLength * objectInfos.length)
  );
  uniformData.set(
    objectInfos.map((objectInfo) => {
      return { position: objectInfo.position, velocity: objectInfo.velocity };
    })
  );

  const storageBuffer = device.createBuffer({
    size: uniformData.arrayBuffer.byteLength,
    usage:
      GPUBufferUsage.STORAGE |
      GPUBufferUsage.COPY_DST |
      GPUBufferUsage.COPY_SRC,
  });
  device.queue.writeBuffer(storageBuffer, 0, uniformData.arrayBuffer);
  // const storageResultBuffer = device.createBuffer({
  //   size: uniformData.arrayBuffer.byteLength,
  //   usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
  // });

  const cameraData = makeStructuredView(defs.uniforms.cameraData);
  const cameraDataBuffer = device.createBuffer({
    size: cameraData.arrayBuffer.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const bindGroup0 = device.createBindGroup({
    layout: bindGroupLayoutGroup0,
    entries: [
      { binding: 0, resource: { buffer: cameraDataBuffer } },
      { binding: 1, resource: texture.createView() },
      { binding: 2, resource: sampler },
    ],
  });

  const bindGroup1 = device.createBindGroup({
    layout: bindGroupLayoutGroup1,
    entries: [{ binding: 0, resource: { buffer: storageBuffer } }],
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
        buffer: { type: "storage" },
      },
    ],
  });

  const computePipelineLayout = device.createPipelineLayout({
    bindGroupLayouts: [computeBindGroupLayoutGroup0],
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
    entries: [{ binding: 0, resource: { buffer: storageBuffer } }],
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

    console.log(1 / deltaTime);

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
    passEncoder.setVertexBuffer(0, vertexBuffer);
    passEncoder.setVertexBuffer(1, normalBuffer);
    passEncoder.setVertexBuffer(2, uvBuffer);
    passEncoder.setIndexBuffer(indexBuffer, "uint32");

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

    passEncoder.drawIndexed(indices.length, numObjects);

    passEncoder.end();

    const computePassEncoder = commandEncoder.beginComputePass();

    computePassEncoder.setPipeline(computePipeline);
    computePassEncoder.setBindGroup(0, computeBindGroup0);
    computePassEncoder.dispatchWorkgroups(objectInfos.length / 64);
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
