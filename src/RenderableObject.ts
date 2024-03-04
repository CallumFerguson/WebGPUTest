import { mat4, quat, vec3 } from "gl-matrix";
import { StructuredView } from "webgpu-utils/dist/1.x/buffer-views";

export class RenderableObject {
  position: vec3;
  rotation: quat;
  scale: vec3;

  uniformDataValues: StructuredView;
  uniformBuffer: GPUBuffer;
  gpuBindGroup: GPUBindGroup;

  private modelMatrix: mat4;
  private mvpMatrix: mat4;

  constructor(
    position: vec3,
    uniformDataValues: StructuredView,
    uniformBuffer: GPUBuffer,
    gpuBindGroup: GPUBindGroup
  ) {
    this.rotation = quat.create();
    quat.rotateX(this.rotation, this.rotation, Math.random() * 100);
    quat.rotateY(this.rotation, this.rotation, Math.random() * 100);
    quat.rotateZ(this.rotation, this.rotation, Math.random() * 100);
    this.position = position;
    const size = 0.005;
    this.scale = vec3.fromValues(size, size, size);

    this.modelMatrix = mat4.create();
    this.model();

    this.mvpMatrix = mat4.create();

    this.uniformDataValues = uniformDataValues;
    this.uniformBuffer = uniformBuffer;
    this.gpuBindGroup = gpuBindGroup;
  }

  model() {
    mat4.fromRotationTranslationScale(
      this.modelMatrix,
      this.rotation,
      this.position,
      this.scale
    );
    return this.modelMatrix;
  }

  mvp(view: mat4, projection: mat4): mat4 {
    mat4.mul(this.mvpMatrix, view, this.model());
    mat4.mul(this.mvpMatrix, projection, this.mvpMatrix);
    return this.mvpMatrix;
  }
}
