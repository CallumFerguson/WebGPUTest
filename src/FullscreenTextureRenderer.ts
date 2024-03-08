import fullscreenTextureShaderString from "../shaders/fullscreenTexture.wgsl?raw";

export class FullscreenTextureRenderer {
  render: (renderPassEncoder: GPURenderPassEncoder) => void;
  resize: (textureView: GPUTextureView) => void;

  constructor(
    device: GPUDevice,
    presentationFormat: GPUTextureFormat,
    textureView: GPUTextureView
  ) {
    const shaderModule = device.createShaderModule({
      code: fullscreenTextureShaderString,
    });

    const bindGroupLayoutGroup0 = device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          texture: {},
        },
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          sampler: {},
        },
      ],
    });

    const pipelineLayout = device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayoutGroup0],
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

    const sampler = device.createSampler({
      magFilter: "nearest",
      minFilter: "nearest",
    });

    let bindGroup0 = device.createBindGroup({
      layout: bindGroupLayoutGroup0,
      entries: [
        { binding: 0, resource: textureView },
        { binding: 1, resource: sampler },
      ],
    });

    this.resize = (textureView: GPUTextureView) => {
      bindGroup0 = device.createBindGroup({
        layout: bindGroupLayoutGroup0,
        entries: [
          { binding: 0, resource: textureView },
          { binding: 1, resource: sampler },
        ],
      });
    };

    this.render = (renderPassEncoder: GPURenderPassEncoder) => {
      renderPassEncoder.setPipeline(pipeline);
      renderPassEncoder.setBindGroup(0, bindGroup0);
      renderPassEncoder.draw(3);
    };
  }
}
