import pointParticleShaderString from "../shaders/pointParticle.wgsl?raw";
import computeShaderString from "../shaders/compute.wgsl?raw";
import { mat4, vec3, quat } from "gl-matrix";
import { getDevice } from "./utility";
import { ParticleRender } from "./ParticleRender";
import { ParticleComputer } from "./ParticleComputer";
import { makeShaderDataDefinitions, makeStructuredView } from "webgpu-utils";
import { BackgroundRenderer } from "./BackgroundRenderer";

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

  let cameraParentModel = mat4.create();
  let cameraParentRotation = quat.create();
  let cameraParentPosition = vec3.fromValues(0, 0, -1);

  let cameraModel = mat4.create();
  let cameraRotation = quat.create();
  let cameraPosition = vec3.fromValues(0, 0, 1);

  let view = mat4.create();
  calculateView();

  function calculateView() {
    mat4.fromRotationTranslation(
      cameraParentModel,
      cameraParentRotation,
      cameraParentPosition
    );

    mat4.fromRotationTranslation(cameraModel, cameraRotation, cameraPosition);
    mat4.mul(cameraModel, cameraParentModel, cameraModel);

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
    presentationFormat,
    cameraDataBuffer,
    numObjects
  );
  const particleComputer = new ParticleComputer(
    device,
    particleRenderer.positionsBuffer,
    timeBuffer,
    numObjects
  );

  const backgroundRenderer = new BackgroundRenderer(device, presentationFormat);

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
    cameraPosition[2] = Math.min(
      Math.max(
        minDist,
        cameraPosition[2] * (1 + event.deltaY / (500 / sensitivity))
      ),
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
        cameraParentRotation,
        cameraParentRotation,
        (Math.PI / 180) * mouseDeltaX * sensitivity
      );

      quat.rotateX(
        cameraParentRotation,
        cameraParentRotation,
        (Math.PI / 180) * mouseDeltaY * sensitivity
      );

      calculateView();
    }

    timeData.set({
      deltaTime: Math.min(deltaTime, 0.01),
    });
    device.queue.writeBuffer(timeBuffer, 0, timeData.arrayBuffer);

    cameraData.set({
      view: view,
      projection: projection,
    });
    device.queue.writeBuffer(cameraDataBuffer, 0, cameraData.arrayBuffer);

    const commandEncoder = device.createCommandEncoder();

    // @ts-ignore
    renderPassDescriptor.colorAttachments[0].view = context
      .getCurrentTexture()
      .createView();

    const renderPassEncoder = commandEncoder.beginRenderPass(
      renderPassDescriptor as GPURenderPassDescriptor
    );

    backgroundRenderer.render(renderPassEncoder);
    particleRenderer.render(renderPassEncoder);

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
