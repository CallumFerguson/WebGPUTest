import { mat4, vec3 } from "gl-matrix";
import { makeShaderDataDefinitions, makeStructuredView } from "webgpu-utils";
import cameraDataShaderString from "../../shaders/cameraData.wgsl?raw";

const views: mat4[] = [
  mat4.fromRotation(
    mat4.create(),
    (Math.PI / 180) * 90,
    vec3.fromValues(0, 1, 0)
  ),
  mat4.fromRotation(
    mat4.create(),
    (Math.PI / 180) * -90,
    vec3.fromValues(0, 1, 0)
  ),
  mat4.fromRotation(
    mat4.create(),
    (Math.PI / 180) * -90,
    vec3.fromValues(1, 0, 0)
  ),
  mat4.fromRotation(
    mat4.create(),
    (Math.PI / 180) * 90,
    vec3.fromValues(1, 0, 0)
  ),
  mat4.fromRotation(mat4.create(), 0, vec3.fromValues(0, 1, 0)),
  mat4.fromRotation(
    mat4.create(),
    (Math.PI / 180) * 180,
    vec3.fromValues(0, 1, 0)
  ),
];

let _cubeMapCameraDataBindGroupLayout: GPUBindGroupLayout | undefined;
export function getCubeMapCameraDataBindGroupLayout(device: GPUDevice) {
  if (!_cubeMapCameraDataBindGroupLayout) {
    _cubeMapCameraDataBindGroupLayout =
      createCubeMapCameraDataBindGroupLayout(device);
  }
  return _cubeMapCameraDataBindGroupLayout;
}

function createCubeMapCameraDataBindGroupLayout(device: GPUDevice) {
  return device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        buffer: {},
      },
    ],
  });
}

let _cubeMapCameraDataBindGroups: GPUBindGroup[] | undefined = undefined;
export function getCubeMapCameraDataBindGroups(device: GPUDevice) {
  if (!_cubeMapCameraDataBindGroups) {
    _cubeMapCameraDataBindGroups = createCubeMapCameraDataBindGroups(device);
  }
  return _cubeMapCameraDataBindGroups;
}

function createCubeMapCameraDataBindGroups(device: GPUDevice) {
  const cameraDataDefs = makeShaderDataDefinitions(cameraDataShaderString);

  return views.map((view) => {
    const cameraData = makeStructuredView(cameraDataDefs.structs.CameraData);
    const cameraDataBuffer = device.createBuffer({
      size: cameraData.arrayBuffer.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    let projection = mat4.create();
    mat4.perspectiveZO(projection, (Math.PI / 180) * 90, 1, 0.01, 1000);
    let viewDirectionProjectionInverse = mat4.create();

    mat4.copy(viewDirectionProjectionInverse, view);
    mat4.mul(
      viewDirectionProjectionInverse,
      projection,
      viewDirectionProjectionInverse
    );
    mat4.invert(viewDirectionProjectionInverse, viewDirectionProjectionInverse);

    cameraData.set({
      viewDirectionProjectionInverse,
    });
    device.queue.writeBuffer(cameraDataBuffer, 0, cameraData.arrayBuffer);

    return device.createBindGroup({
      layout: getCubeMapCameraDataBindGroupLayout(device),
      entries: [{ binding: 0, resource: { buffer: cameraDataBuffer } }],
    });
  });
}
