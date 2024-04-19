import calculateBRDFShaderString from "../shaders/calculateBRDF.wgsl?raw";
import { GPUTimingHelper } from "./GPUTimingHelper";

export function calculateBRDFTexture(device: GPUDevice) {
  const format = "rgba16float";
  const texture = device.createTexture({
    size: [512, 512],
    format,
    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
  });

  const shaderModule = device.createShaderModule({
    code: calculateBRDFShaderString,
  });

  const pipelineLayout = device.createPipelineLayout({
    bindGroupLayouts: [],
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
          format,
        },
      ],
    },
    primitive: {
      topology: "triangle-list",
      cullMode: "none",
    },
  };
  const pipeline = device.createRenderPipeline(pipelineDescriptor);

  const renderPassDescriptor: GPURenderPassDescriptor = {
    colorAttachments: [
      {
        view: texture.createView(),
        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
        loadOp: "clear",
        storeOp: "store",
      },
    ],
  };
  const timer = new GPUTimingHelper(device, renderPassDescriptor);

  const commandEncoder = device.createCommandEncoder();

  const renderPassEncoder =
    commandEncoder.beginRenderPass(renderPassDescriptor);

  renderPassEncoder.setPipeline(pipeline);
  renderPassEncoder.draw(3);

  renderPassEncoder.end();

  timer.storeTime(commandEncoder);

  device.queue.submit([commandEncoder.finish()]);

  timer.recordTime();

  // timer.newResultCallback = (gpuTime: number) => {
  //   console.log(`BRDF time: ${gpuTime.toFixed(2)}ms`);
  // };

  return texture;
}
