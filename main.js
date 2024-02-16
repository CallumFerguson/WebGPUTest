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
  const context = canvas.getContext("webgpu");

  const presentationFormat = gpu.getPreferredCanvasFormat(adapter);
  context.configure({
    device,
    format: presentationFormat,
    alpha: "opaque",
  });

  const positions = new Float32Array([0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1]);
  const indices = new Uint16Array([0, 1, 2, 0]); // added 0 padding so it is a multiple of 8

  const positionBuffer = createBuffer(
    device,
    positions,
    GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
  );
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
        clearValue: { r: 0.0, g: 0.0, b: 1.0, a: 1.0 },
        loadOp: "clear",
        storeOp: "store",
      },
    ],
  };

  let buttonClicked = false;
  document.querySelector("button").onclick = () => {
    renderPassDescriptor.colorAttachments[0].clearValue = {
      r: 0.0,
      g: 1.0,
      b: 0.0,
      a: 1.0,
    };

    buttonClicked = true;
  };

  let previousTime = 0;
  function render(currentTime) {
    currentTime *= 0.001;
    const deltaTime = currentTime - previousTime;

    renderPassDescriptor.colorAttachments[0].view = context
      .getCurrentTexture()
      .createView();

    const commandEncoder = device.createCommandEncoder();
    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

    if (buttonClicked) {
      const data = new Float32Array([0.5, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1]);
      device.queue.writeBuffer(positionBuffer, 0, data, 0, data.length);
      buttonClicked = false;
    }

    passEncoder.setPipeline(pipeline);
    passEncoder.setVertexBuffer(0, positionBuffer);
    passEncoder.setIndexBuffer(indicesBuffer, "uint16");
    passEncoder.drawIndexed(Math.floor(indices.length / 3) * 3);

    passEncoder.end();
    device.queue.submit([commandEncoder.finish()]);

    previousTime = currentTime;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

main();