import pointParticleShaderString from "../shaders/pointParticle.wgsl?raw";
import computeShaderString from "../shaders/compute.wgsl?raw";
import { mat4, vec3, quat } from "gl-matrix";
import { getDevice } from "./utility";
import { ParticleRender } from "./ParticleRender";
import { ParticleComputer } from "./ParticleComputer";
import { makeShaderDataDefinitions, makeStructuredView } from "webgpu-utils";

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
    context,
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

  let previousTime = 0;
  async function render(currentTime: number) {
    currentTime *= 0.001;
    const deltaTime = currentTime - previousTime;

    // console.log(1 / deltaTime);

    handleCanvasResize();

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

    particleRenderer.render(commandEncoder);
    particleComputer.render(commandEncoder);

    device.queue.submit([commandEncoder.finish()]);

    previousTime = currentTime;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

window.onload = () => {
  main().then();
};
