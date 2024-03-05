import simpleLitShaderString from "../shaders/simple_lit.wgsl?raw";
import {
  makeShaderDataDefinitions,
  makeStructuredView,
  createTextureFromImage,
} from "webgpu-utils";
import { mat4, vec3, quat } from "gl-matrix";

function createBuffer(
  device: GPUDevice,
  data: any, // TypedArray or ArrayBuffer
  usage: GPUBufferUsageFlags
) {
  const buffer = device.createBuffer({
    size: data.byteLength,
    usage,
    mappedAtCreation: true,
  });

  const mappedRange = buffer.getMappedRange();

  if (data instanceof ArrayBuffer) {
    const view = new Uint8Array(mappedRange);
    view.set(new Uint8Array(data));
  } else {
    const dst = new data.constructor(mappedRange);
    dst.set(data);
  }

  buffer.unmap();
  return buffer;
}

async function loadModel(fileName: string): Promise<{
  vertices: Float32Array;
  normals: Float32Array;
  uvs: Float32Array;
  textureURI: string;
  indices: Uint32Array;
}> {
  // @ts-ignore
  const ajs: any = await assimpjs();

  // fetch the files to import
  let files = [fileName];

  const resultJson: any = await new Promise((resolve, reject) => {
    Promise.all(files.map((file) => fetch(file)))
      .then((responses) => {
        return Promise.all(responses.map((res) => res.arrayBuffer()));
      })
      .then((arrayBuffers) => {
        // create new file list object, and add the files
        let fileList = new ajs.FileList();
        for (let i = 0; i < files.length; i++) {
          fileList.AddFile(files[i], new Uint8Array(arrayBuffers[i]));
        }

        // convert file list to assimp json
        let result = ajs.ConvertFileList(fileList, "assjson");

        // check if the conversion succeeded
        if (!result.IsSuccess() || result.FileCount() == 0) {
          console.log(result.GetErrorCode());
          reject(result.GetErrorCode());
          return;
        }

        // get the result file, and convert to string
        let resultFile = result.GetFile(0);
        let jsonContent = new TextDecoder().decode(resultFile.GetContent());

        // parse the result json
        let resultJson = JSON.parse(jsonContent);
        resolve(resultJson);
      });
  });

  let mesh = resultJson.meshes[0];

  const vertices = Float32Array.from(mesh.vertices);
  const normals = Float32Array.from(mesh.normals);
  if (mesh.texturecoords.length < 1) {
    console.log("texture missing texurecoords");
  }
  if (mesh.texturecoords.length > 1) {
    console.log("texture has multiple sets of texturecoords");
    console.log(mesh.texturecoords);
  }
  const uvs = Float32Array.from(mesh.texturecoords[0]);
  const indices = Uint32Array.from(mesh.faces.flat());

  const textureJson = resultJson.textures[0];
  const textureURI = `data:image/${textureJson.formathint};base64,${textureJson.data}`;
  // const textureURI = `data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUA
  //   AAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO
  //       9TXL0Y4OHwAAAABJRU5ErkJggg==`;

  return { vertices, normals, uvs, textureURI, indices };
}

async function main() {
  const gpu = navigator.gpu;
  if (!gpu) {
    console.log("browser does not support WebGPU");
    alert("browser does not support WebGPU");
    return;
  }
  const adapter = await gpu?.requestAdapter({
    powerPreference: "high-performance",
  });
  if (!adapter) {
    console.log("browser does not support WebGPU");
    alert("browser does not support WebGPU");
    return;
  }
  const device = await adapter.requestDevice();
  if (!device) {
    console.log("browser does not support WebGPU");
    alert("browser does not support WebGPU");
    return;
  }

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
    alphaMode: "premultiplied",
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

  const numObjects = 5000; // 500000
  const objectInfos: { model: mat4; velocity: vec3; angularVelocity: vec3 }[] =
    [];
  const size = 0.01;
  for (let i = 0; i < numObjects; i++) {
    const model = mat4.create();
    mat4.fromRotationTranslationScale(
      model,
      quat.create(),
      vec3.fromValues(0, 0, -1),
      vec3.fromValues(size, size, size)
    );
    objectInfos.push({
      model: model,
      velocity: vec3.fromValues(
        (Math.random() - 0.5) / 5,
        (Math.random() - 0.5) / 5,
        (Math.random() - 0.5) / 5
      ),
      angularVelocity: vec3.fromValues(
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5
      ),
    });
  }

  const defs = makeShaderDataDefinitions(simpleLitShaderString);

  const uniformDataByteLength = // @ts-ignore
    defs.storages.uniformData.typeDefinition.elementType.size;
  const uniformData = makeStructuredView(
    defs.storages.uniformData,
    new ArrayBuffer(uniformDataByteLength * objectInfos.length)
  );

  const storageBuffer = device.createBuffer({
    size: uniformData.arrayBuffer.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });

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
  function render(currentTime: number) {
    currentTime *= 0.001;
    const deltaTime = currentTime - previousTime;

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

    for (let i = 0; i < objectInfos.length; i++) {
      const objectInfo = objectInfos[i];

      const step = vec3.create();
      vec3.copy(step, objectInfo.velocity);
      vec3.scale(step, step, deltaTime / size);
      mat4.translate(objectInfo.model, objectInfo.model, step);

      // mat4.rotate(
      //   objectInfo.model,
      //   objectInfo.model,
      //   vec3.length(objectInfo.angularVelocity) * deltaTime,
      //   objectInfo.angularVelocity
      // );
    }

    uniformData.set(
      objectInfos.map((objectInfo) => {
        return { model: objectInfo.model };
      })
    );

    device.queue.writeBuffer(storageBuffer, 0, uniformData.arrayBuffer);

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
    device.queue.submit([commandEncoder.finish()]);

    previousTime = currentTime;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

window.onload = () => {
  main().then();
};
