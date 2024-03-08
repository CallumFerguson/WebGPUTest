import fullscreenColorShaderString from "../shaders/fullscreenColor.wgsl?raw";

export class BackgroundRenderer {
  render: (renderPassEncoder: GPURenderPassEncoder) => void;
  constructor(device: GPUDevice, presentationFormat: GPUTextureFormat) {
    const shaderModule = device.createShaderModule({
      code: fullscreenColorShaderString,
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
            format: presentationFormat,
          },
        ],
      },
      primitive: {
        topology: "triangle-list",
        cullMode: "none",
      },
      multisample: {
        count: 1,
      },
    };
    const pipeline = device.createRenderPipeline(pipelineDescriptor);

    this.render = (renderPassEncoder: GPURenderPassEncoder) => {
      renderPassEncoder.setPipeline(pipeline);
      renderPassEncoder.draw(3);
    };
  }
}
