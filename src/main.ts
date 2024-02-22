import simpleRedShaderString from "../shaders/simple_red.wgsl?raw";

function createBuffer(
  device: GPUDevice,
  data: any,
  usage: GPUBufferUsageFlags
) {
  const buffer = device.createBuffer({
    size: data.byteLength,
    usage,
    mappedAtCreation: true,
  });
  const dst = new data.constructor(buffer.getMappedRange());
  dst.set(data);
  buffer.unmap();
  return buffer;
}

async function loadModel(
  fileName: string
): Promise<{ vertices: Float32Array; indices: Uint32Array }> {
  // @ts-ignore
  const ajs: any = await assimpjs();

  // fetch the files to import
  let files = [fileName];

  return new Promise((resolve, reject) => {
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

        let mesh = resultJson.meshes[0];

        const vertices = Float32Array.from(mesh.vertices);
        const indices = Uint32Array.from(mesh.faces.flat());

        resolve({ vertices, indices });
      });
  });
}

async function main() {
  const gpu = navigator.gpu;
  const adapter = await gpu?.requestAdapter({
    powerPreference: "high-performance",
  });
  const device = await adapter?.requestDevice();
  if (!device || !gpu) {
    console.log("browser does not support WebGPU");
    alert("browser does not support WebGPU");
    return;
  }

  const canvas = document.querySelector("canvas");
  if (canvas === null) {
    console.log("no canvas");
    return;
  }
  const context = canvas.getContext("webgpu");
  if (context === null) {
    console.log("webgpu context was null");
    return;
  }

  const presentationFormat = gpu.getPreferredCanvasFormat();
  context.configure({
    device,
    format: presentationFormat,
    alphaMode: "opaque",
  });

  let { vertices, indices } = await loadModel("duck.glb");

  // const vertices = new Float32Array([-0.5, -0.5, 0, 0.5, -0.5, 0, 0, 0.5, 0]);
  // const indices = new Uint32Array([0, 1, 2]);

  const vertexBuffer = createBuffer(
    device,
    vertices,
    GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
  );
  const indexBuffer = createBuffer(device, indices, GPUBufferUsage.INDEX);

  const shaderModule = device.createShaderModule({
    code: simpleRedShaderString,
  });

  // const bindGroupLayout = device.createBindGroupLayout({
  //   entries: [
  //     {
  //       binding: 0, // camera uniforms
  //       visibility: GPUShaderStage.VERTEX,
  //       buffer: {},
  //     },
  //     {
  //       binding: 1, // model uniform
  //       visibility: GPUShaderStage.VERTEX,
  //       buffer: {},
  //     },
  //     {
  //       binding: 2, // baseColor texture
  //       visibility: GPUShaderStage.FRAGMENT,
  //       texture: {},
  //     },
  //     {
  //       binding: 3, // baseColor sampler
  //       visibility: GPUShaderStage.FRAGMENT,
  //       sampler: {},
  //     },
  //   ],
  // });

  const pipelineLayout = device.createPipelineLayout({
    bindGroupLayouts: [],
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
      ],
    },
    fragment: {
      module: shaderModule,
      entryPoint: "frag",
      targets: [{ format: presentationFormat }],
    },
    primitive: {
      topology: "triangle-list",
      cullMode: "back",
    },
    multisample: {
      count: 4,
    },
  };
  const pipeline = device.createRenderPipeline(pipelineDescriptor);

  const renderPassDescriptor = {
    colorAttachments: [
      {
        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
        loadOp: "clear",
        storeOp: "store",
      },
    ],
  };

  if (
    pipelineDescriptor.multisample &&
    pipelineDescriptor.multisample.count !== 1
  ) {
    const multisampleTexture = device.createTexture({
      format: presentationFormat,
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
      size: [canvas.width, canvas.height],
      sampleCount: pipelineDescriptor.multisample.count,
    });
    // @ts-ignore
    renderPassDescriptor.colorAttachments[0].view =
      multisampleTexture.createView();
  }

  // let previousTime = 0;
  function render(/* currentTime: number */) {
    // currentTime *= 0.001;
    // const deltaTime = currentTime - previousTime;

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

    if (!device) {
      console.log("device is undefined in render()");
      return;
    }

    const commandEncoder = device.createCommandEncoder();
    const passEncoder = commandEncoder.beginRenderPass(
      renderPassDescriptor as GPURenderPassDescriptor
    );

    passEncoder.setPipeline(pipeline);
    passEncoder.setVertexBuffer(0, vertexBuffer);
    passEncoder.setIndexBuffer(indexBuffer, "uint32");
    passEncoder.drawIndexed(Math.floor(indices.length / 3) * 3);

    passEncoder.end();
    device.queue.submit([commandEncoder.finish()]);

    // previousTime = currentTime;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

window.onload = () => {
  main().then();
};
