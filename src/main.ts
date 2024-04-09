import cameraDataShaderString from "../shaders/cameraData.wgsl?raw";
import computeParticleShaderString from "../shaders/computeParticle.wgsl?raw";
import fullscreenTextureShaderString from "../shaders/fullscreenTexture.wgsl?raw";
import { mat4, vec3, vec4, quat } from "gl-matrix";
import { clamp, getDevice } from "./utility";
import {
  createTextureFromImages,
  makeShaderDataDefinitions,
  makeStructuredView,
} from "webgpu-utils";
import {
  fixedDeltaTime,
  largestAllowedDeltaTime,
  multisampleCount,
} from "./constants";
import { SkyboxRenderer } from "./SkyboxRenderer";
import { GLTFRenderer } from "./GLTFRenderer";
import { CubeMap } from "./CubeMap/CubeMap";
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

  const renderFunctions: ((renderPassEncoder: GPURenderPassEncoder) => void)[] =
    [];
  const computeFunctions: ((
    computePassEncoder: GPUComputePassEncoder,
    numFixedUpdatesThisFrame: number,
    currentTime: number
  ) => void)[] = [];
  const renderPassFunctions: ((commandEncoder: GPUCommandEncoder) => void)[] =
    [];
  const fixedUpdateFunctions: ((fixedDeltaTime: number) => void)[] = [];

  let projection = mat4.create();

  let cameraParentXModel = mat4.create();
  let cameraParentXRotation = quat.create();
  let cameraParentXPosition = vec3.fromValues(0, 0, 0);

  let cameraParentYEuler = 0;
  let cameraParentYModel = mat4.create();
  let cameraParentYRotation = quat.create();
  let cameraParentYPosition = vec3.fromValues(0, 0, 0);

  let cameraModel = mat4.create();
  let cameraRotation = quat.create();
  let cameraPosition = vec3.fromValues(0, 0, 15);

  let view = mat4.create();
  let viewDirectionProjectionInverse = mat4.create();
  let cameraWorldPositionVec4 = vec4.create();
  let cameraWorldPosition = vec3.create();

  function calculateViewProjection() {
    mat4.perspectiveZO(
      projection,
      (Math.PI / 180) * 90,
      canvas.width / canvas.height,
      0.01,
      1000
    );

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

    cameraWorldPositionVec4[0] = 0;
    cameraWorldPositionVec4[1] = 0;
    cameraWorldPositionVec4[2] = 0;
    cameraWorldPositionVec4[3] = 1;
    vec4.transformMat4(
      cameraWorldPositionVec4,
      cameraWorldPositionVec4,
      cameraModel
    );
    cameraWorldPosition[0] = cameraWorldPositionVec4[0];
    cameraWorldPosition[1] = cameraWorldPositionVec4[1];
    cameraWorldPosition[2] = cameraWorldPositionVec4[2];

    mat4.invert(view, cameraModel);

    mat4.copy(viewDirectionProjectionInverse, view);
    // remove the translation
    viewDirectionProjectionInverse[12] = 0;
    viewDirectionProjectionInverse[13] = 0;
    viewDirectionProjectionInverse[14] = 0;
    mat4.mul(
      viewDirectionProjectionInverse,
      projection,
      viewDirectionProjectionInverse
    );
    mat4.invert(viewDirectionProjectionInverse, viewDirectionProjectionInverse);
  }
  calculateViewProjection();

  const cameraDataDefs = makeShaderDataDefinitions(cameraDataShaderString);
  const cameraData = makeStructuredView(cameraDataDefs.structs.CameraData);
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

  function writeCameraBuffer() {
    cameraData.set({
      view,
      projection,
      position: cameraWorldPosition,
      viewDirectionProjectionInverse,
    });
    device.queue.writeBuffer(cameraDataBuffer, 0, cameraData.arrayBuffer);
  }
  writeCameraBuffer();

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

  // const rotation = mat4.create();
  // mat4.rotateZ(rotation, rotation, -((Math.PI / 180) * 45) / 2);
  // mat4.rotateX(rotation, rotation, -((Math.PI / 180) * 45) / 2);
  // const bounds: Bounds = {
  //   size: [50, 50, 50],
  //   center: [0, 0, 0],
  //   rotation,
  // };
  //
  // const numObjects = 64 * 5; // 50
  // const ballRenderer = new BallRenderer();
  // await ballRenderer.init(
  //   device,
  //   presentationFormat,
  //   cameraDataBuffer,
  //   numObjects
  // );
  // fixedUpdateFunctions.push(ballRenderer.fixedUpdate);
  // renderFunctions.push(ballRenderer.render);
  //
  // const ballComputer = new BallComputer(
  //   device,
  //   ballRenderer.positionBufferBundles,
  //   numObjects,
  //   bounds
  // );
  // computeFunctions.push(ballComputer.compute);
  //
  // const boundsRenderer = new BoundsRenderer(
  //   device,
  //   presentationFormat,
  //   cameraDataBuffer,
  //   ballComputer.simulationInfoBuffer
  // );
  // renderFunctions.push(boundsRenderer.render);
  //
  // const cubeMapReflectionRenderer = new CubeMapReflectionRenderer();
  // await cubeMapReflectionRenderer.init(
  //   device,
  //   presentationFormat,
  //   cameraDataBuffer
  // );
  // renderFunctions.push(cubeMapReflectionRenderer.render!);

  const cubeMap = new CubeMap();
  await cubeMap.init(device, "symmetrical_garden_02_4k.hdr");

  // const fullscreenTextureRenderer = new FullscreenTextureRenderer(
  //   device,
  //   presentationFormat,
  //   cubeMap.equirectangularTexture!.createView(),
  //   fullscreenTextureShaderString
  // );
  // renderFunctions.push(fullscreenTextureRenderer.render);

  const gltfRenderer = new GLTFRenderer();
  await gltfRenderer.init(
    "tangents.glb",
    device,
    presentationFormat,
    cameraDataBuffer
  );
  renderFunctions.push(gltfRenderer.render!);

  // const yokohamaCubeMapTexture = await createTextureFromImages(
  //   device,
  //   [
  //     "Yokohama/posx.jpg",
  //     "Yokohama/negx.jpg",
  //     "Yokohama/posy.jpg",
  //     "Yokohama/negy.jpg",
  //     "Yokohama/posz.jpg",
  //     "Yokohama/negz.jpg",
  //   ],
  //   {
  //     mips: true,
  //   }
  // );

  const skyboxRenderer = new SkyboxRenderer();
  await skyboxRenderer.init(
    device,
    presentationFormat,
    cubeMap.irradianceCubeMapTexture!,
    cameraDataBuffer
  );
  renderFunctions.push(skyboxRenderer.render!);

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

    createNewDepthTexture();
    createNewMultisampleTexture();
    calculateViewProjection();
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
  function createNewDepthTexture() {
    if (depthTexture) {
      depthTexture.destroy();
    }
    depthTexture = device.createTexture({
      size: [canvas.width, canvas.height],
      format: "depth24plus",
      sampleCount: multisampleCount,
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });
    // @ts-ignore
    renderPassDescriptor.depthStencilAttachment.view =
      depthTexture.createView();
  }
  createNewDepthTexture();

  let multisampleTexture: GPUTexture | undefined = undefined;
  function createNewMultisampleTexture() {
    if (multisampleTexture) {
      multisampleTexture.destroy();
    }
    if (multisampleCount !== 1) {
      multisampleTexture = device.createTexture({
        format: presentationFormat,
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
        size: [canvas.width, canvas.height],
        sampleCount: multisampleCount,
      });
      // @ts-ignore
      renderPassDescriptor.colorAttachments[0].view =
        multisampleTexture.createView();
    }
  }
  createNewMultisampleTexture();

  let mouseX = 0;
  let mouseY = 0;
  let lastMouseX = 0;
  let lastMouseY = 0;
  document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  let leftMouseDown = false;
  let rightMouseDown = false;
  document.addEventListener("mousedown", (event) => {
    if (event.button === 0) {
      leftMouseDown = true;
    } else if (event.button === 2) {
      rightMouseDown = true;
    }
  });

  document.addEventListener("mouseup", (event) => {
    if (event.button === 0) {
      leftMouseDown = false;
    } else if (event.button === 2) {
      rightMouseDown = false;
    }
  });

  document.addEventListener("wheel", (event) => {
    const sensitivity = 1.5;
    const minDist = 0.5;
    const maxDist = 250;
    cameraPosition[2] = clamp(
      cameraPosition[2] * (1 + event.deltaY / (500 / sensitivity)),
      minDist,
      maxDist
    );
    calculateViewProjection();
  });

  const objectModelTmp = mat4.create();

  let currentTime = 0;

  let simulationRunningSlow = false;

  let lastRealTimeSinceStart = 0;
  let accumulatedTime = 0;
  async function render(realTimeSinceStart: number) {
    realTimeSinceStart *= 0.001;
    const realDeltaTime = realTimeSinceStart - lastRealTimeSinceStart;
    const deltaTime = Math.min(realDeltaTime, largestAllowedDeltaTime);
    accumulatedTime += deltaTime;
    let mouseDeltaX = lastMouseX - mouseX;
    let mouseDeltaY = lastMouseY - mouseY;

    currentTime += deltaTime;

    // console.log(1 / realDeltaTime);

    const simulationSpeed = deltaTime / realDeltaTime;
    if (simulationSpeed !== 1) {
      simulationRunningSlow = true;
      console.log(
        `simulation running at ${
          Math.round(simulationSpeed * 1000) / 10
        }% normal speed.`
      );
    } else if (simulationRunningSlow) {
      simulationRunningSlow = false;
      console.log(`simulation running at 100% normal speed.`);
    }

    handleCanvasResize();

    if (mouseDeltaX !== 0 || mouseDeltaY !== 0) {
      if (leftMouseDown) {
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

        calculateViewProjection();
      } else if (rightMouseDown) {
        // const sensitivity = 0.5;
        // // mat4.rotateY(
        // //   bounds.rotation,
        // //   bounds.rotation,
        // //   mouseDeltaX * sensitivity
        // // );
        // const rotateBy = mat4.create();
        // mat4.rotateY(
        //   rotateBy,
        //   rotateBy,
        //   (Math.PI / 180) * -mouseDeltaX * sensitivity
        // );
        // mat4.mul(bounds.rotation, rotateBy, bounds.rotation);
        //
        // mat4.identity(rotateBy);
        // mat4.rotateX(
        //   rotateBy,
        //   rotateBy,
        //   (Math.PI / 180) * -mouseDeltaY * sensitivity
        // );
        // mat4.mul(bounds.rotation, rotateBy, bounds.rotation);
        //
        // ballComputer.updateBounds();
      }
    }

    let numFixedUpdatesThisFrame = 0;
    while (accumulatedTime >= fixedDeltaTime) {
      // if (numFixedUpdatesThisFrame >= maxFixedUpdatesPerFrame) {
      //   console.log(
      //     "numFixedUpdatesThisFrame exceeded maxFixedUpdatesPerFrame."
      //   );
      //   break;
      // }
      numFixedUpdatesThisFrame++;
      fixedUpdateFunctions.forEach((fixedUpdateFunction) => {
        fixedUpdateFunction(fixedDeltaTime);
      });
      accumulatedTime -= fixedDeltaTime;
    }
    // console.log(numFixedUpdatesThisFrame);

    timeData.set({
      deltaTime: Math.min(deltaTime, 0.01),
    });
    device.queue.writeBuffer(timeBuffer, 0, timeData.arrayBuffer);

    mat4.rotateY(
      objectModelTmp,
      objectModelTmp,
      (Math.PI / 180) * deltaTime * 10
    );

    writeCameraBuffer();

    const commandEncoder = device.createCommandEncoder();

    if (multisampleCount !== 1) {
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
      computeFunction(
        computePassEncoder,
        numFixedUpdatesThisFrame,
        currentTime
      );
    });

    computePassEncoder.end();

    device.queue.submit([commandEncoder.finish()]);

    lastRealTimeSinceStart = realTimeSinceStart;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

window.onload = () => {
  main().then();
};
