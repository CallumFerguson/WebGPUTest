import simpleRedShaderString from "./shaders/simple_red.wgsl?raw";

function createBuffer(device, data, usage) {
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

async function main() {
  const gpu = navigator.gpu;
  const adapter = await gpu?.requestAdapter();
  const device = await adapter?.requestDevice();
  if (!device || !gpu) {
    console.log("browser does not support WebGPU");
    alert("browser does not support WebGPU");
    return;
  }

  const canvas = document.querySelector("canvas");
  const context = canvas.getContext("webgpu");

  const presentationFormat = gpu.getPreferredCanvasFormat(adapter);
  context.configure({
    device,
    format: presentationFormat,
  });

  const positions = new Float32Array([0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1]);
  const indices = new Uint16Array([0, 1, 2, 0]); // added 0 padding so it is a multiple of 8

  const positionBuffer = createBuffer(device, positions, GPUBufferUsage.VERTEX);
  const indicesBuffer = createBuffer(device, indices, GPUBufferUsage.INDEX);

  const shaderModule = device.createShaderModule({
    code: simpleRedShaderString,
  });

  const pipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: {
      module: shaderModule,
      entrypoint: "vert",
      buffers: [
        // position
        {
          arrayStride: 4 * 4,
          attributes: [{ shaderLocation: 0, offset: 0, format: "float32x4" }],
        },
      ],
    },
    fragment: {
      module: shaderModule,
      entrypoint: "frag",
      targets: [{ format: presentationFormat }],
    },
    primitive: {
      topology: "triangle-list",
      cullMode: "back",
    },
  });

  const renderPassDescriptor = {
    colorAttachments: [
      {
        view: context.getCurrentTexture().createView(),
        clearValue: { r: 0.0, g: 0.0, b: 1.0, a: 1.0 },
        loadOp: "clear",
        storeOp: "store",
      },
    ],
  };

  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

  passEncoder.setPipeline(pipeline);
  passEncoder.setVertexBuffer(0, positionBuffer);
  passEncoder.setIndexBuffer(indicesBuffer, "uint16");
  passEncoder.drawIndexed(Math.floor(indices.length / 3) * 3);

  passEncoder.end();
  device.queue.submit([commandEncoder.finish()]);
}

main();
