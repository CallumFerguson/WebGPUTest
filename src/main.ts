import pointParticleShaderString from "../shaders/pointParticle.wgsl?raw";
import computeShaderString from "../shaders/compute.wgsl?raw";
import { mat4, vec3, quat } from "gl-matrix";
import { clamp, getDevice } from "./utility";
import { ParticleRender } from "./ParticleRender";
import { ParticleComputer } from "./ParticleComputer";
import { makeShaderDataDefinitions, makeStructuredView } from "webgpu-utils";
import { BackgroundRenderer } from "./BackgroundRenderer";
import { FullscreenTextureRenderer } from "./FullscreenTextureRenderer";

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

  let cameraParentXModel = mat4.create();
  let cameraParentXRotation = quat.create();
  let cameraParentXPosition = vec3.fromValues(0, 0, -1);

  let cameraParentYEuler = 0;
  let cameraParentYModel = mat4.create();
  let cameraParentYRotation = quat.create();
  let cameraParentYPosition = vec3.fromValues(0, 0, 0);

  let cameraModel = mat4.create();
  let cameraRotation = quat.create();
  let cameraPosition = vec3.fromValues(0, 0, 1.25);

  let view = mat4.create();
  calculateView();

  function calculateView() {
    mat4.fromRotationTranslation(
      cameraParentXModel,
      cameraParentXRotation,
      cameraParentXPosition
    );

    mat4.fromRotationTranslation(
      cameraParentYModel,
      cameraParentYRotation,
      cameraParentYPosition
    );

    mat4.fromRotationTranslation(cameraModel, cameraRotation, cameraPosition);

    mat4.mul(cameraModel, cameraParentYModel, cameraModel);
    mat4.mul(cameraModel, cameraParentXModel, cameraModel);

    mat4.invert(view, cameraModel);
  }

  let projection = mat4.create();
  function calculateProjection() {
    mat4.perspectiveZO(projection, 90, canvas.width / canvas.height, 0.01, 100);
  }
  calculateProjection();

  const defs = makeShaderDataDefinitions(pointParticleShaderString);
  const cameraData = makeStructuredView(defs.uniforms.cameraData);
  const cameraDataBuffer = device.createBuffer({
    size: cameraData.arrayBuffer.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const computeDefs = makeShaderDataDefinitions(computeShaderString);
  const timeData = makeStructuredView(computeDefs.uniforms.timeData);
  const timeBuffer = device.createBuffer({
    size: timeData.arrayBuffer.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const numObjects = 8000000; // 8000000
  const particleRenderer = new ParticleRender(
    device,
    cameraDataBuffer,
    numObjects,
    canvas.width,
    canvas.height
  );
  const particleComputer = new ParticleComputer(
    device,
    particleRenderer.positionsBuffer,
    timeBuffer,
    numObjects
  );

  const backgroundRenderer = new BackgroundRenderer(device, presentationFormat);
  const fullscreenTextureRenderer = new FullscreenTextureRenderer(
    device,
    presentationFormat,
    particleRenderer.textureView
  );

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

    particleRenderer.resize(canvas.width, canvas.height);
    fullscreenTextureRenderer.resize(particleRenderer.textureView);

    calculateProjection();
  }

  const renderPassDescriptor: unknown = {
    colorAttachments: [
      {
        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
        loadOp: "clear",
        storeOp: "store",
      },
    ],
  };

  let mouseX = 0;
  let mouseY = 0;
  let lastMouseX = 0;
  let lastMouseY = 0;
  document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  let mouseDown = false;
  document.addEventListener("mousedown", () => {
    mouseDown = true;
  });

  document.addEventListener("mouseup", () => {
    mouseDown = false;
  });

  document.addEventListener("wheel", (event) => {
    const sensitivity = 1.5;
    const minDist = 0.1;
    const maxDist = 25;
    cameraPosition[2] = clamp(
      cameraPosition[2] * (1 + event.deltaY / (500 / sensitivity)),
      minDist,
      maxDist
    );
    calculateView();
  });

  let previousTime = 0;
  async function render(currentTime: number) {
    currentTime *= 0.001;
    const deltaTime = currentTime - previousTime;
    let mouseDeltaX = lastMouseX - mouseX;
    let mouseDeltaY = lastMouseY - mouseY;

    // console.log(1 / deltaTime);

    handleCanvasResize();

    if (mouseDown && (mouseDeltaX !== 0 || mouseDeltaY !== 0)) {
      const sensitivity = 0.5;
      quat.rotateY(
        cameraParentXRotation,
        cameraParentXRotation,
        (Math.PI / 180) * mouseDeltaX * sensitivity
      );

      cameraParentYEuler = clamp(
        cameraParentYEuler + mouseDeltaY * sensitivity,
        -89.9,
        89.9
      );
      quat.fromEuler(cameraParentYRotation, cameraParentYEuler, 0, 0);

      calculateView();
    }

    timeData.set({
      deltaTime: Math.min(deltaTime, 0.01),
    });
    device.queue.writeBuffer(timeBuffer, 0, timeData.arrayBuffer);

    cameraData.set({
      view: view,
      projection: projection,
      canvasHeight: canvas.height,
    });
    device.queue.writeBuffer(cameraDataBuffer, 0, cameraData.arrayBuffer);

    const commandEncoder = device.createCommandEncoder();

    // @ts-ignore
    renderPassDescriptor.colorAttachments[0].view = context
      .getCurrentTexture()
      .createView();

    particleRenderer.renderPass(commandEncoder);

    const renderPassEncoder = commandEncoder.beginRenderPass(
      renderPassDescriptor as GPURenderPassDescriptor
    );

    backgroundRenderer.render(renderPassEncoder);
    fullscreenTextureRenderer.render(renderPassEncoder);

    renderPassEncoder.end();

    const computePassEncoder = commandEncoder.beginComputePass();

    const computeStepsPerFrame = 2;
    for (let i = 0; i < computeStepsPerFrame; i++) {
      particleComputer.compute(computePassEncoder);
    }

    computePassEncoder.end();

    device.queue.submit([commandEncoder.finish()]);

    previousTime = currentTime;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

window.onload = () => {
  main().then();
};
