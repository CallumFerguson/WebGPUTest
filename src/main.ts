import pointParticleShaderString from "../shaders/pointParticle.wgsl?raw";
import computeParticleShaderString from "../shaders/computeParticle.wgsl?raw";
import { mat4, vec3, quat } from "gl-matrix";
import { Bounds, clamp, getDevice } from "./utility";
import { makeShaderDataDefinitions, makeStructuredView } from "webgpu-utils";
import { BallRenderer } from "./BallRenderer";
import { BallComputer } from "./BallComputer";
import { fixedDeltaTime } from "./constants";
import { BoundsRenderer } from "./BoundsRenderer";

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

  const renderFunctions: ((renderPassEncoder: GPURenderPassEncoder) => void)[] =
    [];
  const computeFunctions: ((
    computePassEncoder: GPUComputePassEncoder,
    numFixedUpdatesThisFrame: number
  ) => void)[] = [];
  const renderPassFunctions: ((commandEncoder: GPUCommandEncoder) => void)[] =
    [];
  const fixedUpdateFunctions: ((fixedDeltaTime: number) => void)[] = [];

  let cameraParentXModel = mat4.create();
  let cameraParentXRotation = quat.create();
  let cameraParentXPosition = vec3.fromValues(0, 0, 0);

  let cameraParentYEuler = 0;
  let cameraParentYModel = mat4.create();
  let cameraParentYRotation = quat.create();
  let cameraParentYPosition = vec3.fromValues(0, 0, 0);

  let cameraModel = mat4.create();
  let cameraRotation = quat.create();
  let cameraPosition = vec3.fromValues(0, 0, 60);

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
    mat4.perspectiveZO(
      projection,
      90,
      canvas.width / canvas.height,
      0.01,
      1000
    );
  }
  calculateProjection();

  const defs = makeShaderDataDefinitions(pointParticleShaderString);
  const cameraData = makeStructuredView(defs.uniforms.cameraData);
  const cameraDataBuffer = device.createBuffer({
    size: cameraData.arrayBuffer.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const computeDefs = makeShaderDataDefinitions(computeParticleShaderString);
  const timeData = makeStructuredView(computeDefs.uniforms.timeData);
  const timeBuffer = device.createBuffer({
    size: timeData.arrayBuffer.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  // const numObjects = 8000000; // 8000000
  // const particleRenderer = new ParticleRender(
  //   device,
  //   cameraDataBuffer,
  //   numObjects
  // );
  // renderPassFunctions.push(particleRenderer.renderPass);
  //
  // const particleComputer = new ParticleComputer(
  //   device,
  //   particleRenderer.positionsBuffer,
  //   timeBuffer,
  //   numObjects
  // );
  // computeFunctions.push(particleComputer.compute);
  //
  // const fullscreenTextureRenderer = new FullscreenTextureRenderer(
  //   device,
  //   presentationFormat,
  //   particleRenderer.textureView
  // );
  // renderFunctions.push(fullscreenTextureRenderer.render);

  const bounds: Bounds = { size: [50, 50, 50], center: [0, 0, 0] };

  const numObjects = 64 * 300;
  const ballRenderer = new BallRenderer();
  await ballRenderer.init(
    device,
    presentationFormat,
    cameraDataBuffer,
    numObjects
  );
  fixedUpdateFunctions.push(ballRenderer.fixedUpdate);
  renderFunctions.push(ballRenderer.render);

  const ballComputer = new BallComputer(
    device,
    ballRenderer.positionBufferBundles,
    numObjects,
    bounds
  );
  computeFunctions.push(ballComputer.compute);

  const boundsRenderer = new BoundsRenderer(
    device,
    presentationFormat,
    cameraDataBuffer,
    ballComputer.simulationInfoBuffer
  );
  renderFunctions.push(boundsRenderer.render);

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

    createDepthTexture();
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
    depthStencilAttachment: {
      depthClearValue: 1,
      depthLoadOp: "clear",
      depthStoreOp: "store",
    },
  };

  let depthTexture: GPUTexture;
  function createDepthTexture() {
    if (depthTexture) {
      depthTexture.destroy();
    }
    depthTexture = device.createTexture({
      size: [canvas.width, canvas.height],
      format: "depth24plus",
      sampleCount: 1,
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });
    // @ts-ignore
    renderPassDescriptor.depthStencilAttachment.view =
      depthTexture.createView();
  }
  createDepthTexture();

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
    const minDist = 0.5;
    const maxDist = 100;
    cameraPosition[2] = clamp(
      cameraPosition[2] * (1 + event.deltaY / (500 / sensitivity)),
      minDist,
      maxDist
    );
    calculateView();
  });

  const maxFixedUpdatesPerFrame = 10;
  let simulationBehind = false;

  let previousTime = 0;
  let accumulatedTime = 0;
  async function render(currentTime: number) {
    currentTime *= 0.001;
    const deltaTime = currentTime - previousTime;
    accumulatedTime += deltaTime;
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

    let numFixedUpdatesThisFrame = 0;
    while (accumulatedTime >= fixedDeltaTime) {
      if (numFixedUpdatesThisFrame >= maxFixedUpdatesPerFrame) {
        console.log(
          "numFixedUpdatesThisFrame exceeded maxFixedUpdatesPerFrame."
        );
        break;
      }
      numFixedUpdatesThisFrame++;
      fixedUpdateFunctions.forEach((fixedUpdateFunction) => {
        fixedUpdateFunction(fixedDeltaTime);
      });
      accumulatedTime -= fixedDeltaTime;
    }
    if (accumulatedTime >= fixedDeltaTime) {
      console.log(
        `simulation is ${accumulatedTime - fixedDeltaTime} seconds behind`
      );
      simulationBehind = true;
    } else if (simulationBehind) {
      simulationBehind = false;
      console.log("simulation caught up");
    }
    // console.log(numFixedUpdatesThisFrame);

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

    renderPassFunctions.forEach((renderPassFunction) => {
      renderPassFunction(commandEncoder);
    });

    const renderPassEncoder = commandEncoder.beginRenderPass(
      renderPassDescriptor as GPURenderPassDescriptor
    );

    renderFunctions.forEach((renderFunction) => {
      renderFunction(renderPassEncoder);
    });

    renderPassEncoder.end();

    const computePassEncoder = commandEncoder.beginComputePass();

    computeFunctions.forEach((computeFunction) => {
      computeFunction(computePassEncoder, numFixedUpdatesThisFrame);
    });

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
