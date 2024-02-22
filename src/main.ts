import simpleRedShaderString from "../shaders/simple_red.wgsl?raw";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Mesh } from "three";
import duckString from "../public/duck.glb?raw";

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

function gltfFirstMesh(gltf: GLTF): Mesh {
  let firstMesh: Mesh | undefined = undefined;
  gltf.scene.traverse((child) => {
    if (child instanceof Mesh && !firstMesh) {
      firstMesh = child as Mesh;
    }
  });
  if (!firstMesh) {
    throw new Error("no mesh");
  }
  return firstMesh;
}

function loadGLTFModel(fileName: string): Promise<any> {
  const gltfLoader = new GLTFLoader();

  return new Promise((resolve) => {
    gltfLoader.load(fileName, (gltf) => {
      const mesh = gltfFirstMesh(gltf);
      resolve([
        mesh.geometry.attributes.position.array,
        mesh.geometry.index?.array,
      ]);
    });
  });
}

async function test() {
  // @ts-ignore
  // const ajs: any = await assimpjs();

  const test = assimpjs();

  // create new file list object
  // let fileList = new ajs.FileList();

  // // add model files
  // fileList.AddFile("duck.glb", duckString);
  //
  // // convert file list to assimp json
  // let result = ajs.ConvertFileList(fileList, "assjson");
  //
  // // check if the conversion succeeded
  // if (!result.IsSuccess() || result.FileCount() == 0) {
  //   console.log(result.GetErrorCode());
  //   return;
  // }
  //
  // // get the result file, and convert to string
  // let resultFile = result.GetFile(0);
  // let jsonContent = new TextDecoder().decode(resultFile.GetContent());
  //
  // // parse the result json
  // let resultJson = JSON.parse(jsonContent);
  // console.log(resultJson);
}

async function main() {
  test();

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

  let [positions, indices] = await loadGLTFModel("duck.glb");

  // const positions = new Float32Array([
  //   -0.5, -0.5, 0, 1, 0.5, -0.5, 0, 1, 0, 0.5, 0, 1,
  // ]);
  // const indices = new Uint16Array([0, 1, 2, 0]); // added 0 padding so it is a multiple of 8

  const positionBuffer = createBuffer(
    device,
    positions,
    GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
  );
  const indicesBuffer = createBuffer(device, indices, GPUBufferUsage.INDEX);

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
        // position
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
    passEncoder.setVertexBuffer(0, positionBuffer);
    passEncoder.setIndexBuffer(indicesBuffer, "uint16");
    passEncoder.drawIndexed(Math.floor(indices.length / 3) * 3);

    passEncoder.end();
    device.queue.submit([commandEncoder.finish()]);

    // previousTime = currentTime;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

main().then();
