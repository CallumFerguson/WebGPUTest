struct CameraData {
    view: mat4x4f,
    projection: mat4x4f,
    position: vec3f,
//    objectModelTmp: mat4x4f,
}

@group(0) @binding(0) var texture: texture_cube<f32>;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var<uniform> cameraData: CameraData;

struct VertexInput {
    @location(0) position: vec4f,
    @location(1) normal: vec3f,
}

struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) worldPosition: vec3f,
    @location(1) worldNormal: vec3f,
}

@vertex
fn vert(i: VertexInput) -> VertexOutput {
    var o: VertexOutput;

    o.position = cameraData.projection * cameraData.view * i.position;
    o.worldPosition = i.position.xyz;
    o.worldNormal = i.normal;

    return o;
}

@fragment
fn frag(i: VertexOutput) -> @location(0) vec4f {
//    var eyeToSurfaceDir = cameraData.position - i.worldPosition;
//    var eyeToSurfaceDir2 = normalize(eyeToSurfaceDir.xyz);
//    var direction = eyeToSurfaceDir2 - 2 * dot(i.worldNormal, eyeToSurfaceDir2) * i.worldNormal;

    let worldNormal = normalize(i.worldNormal);
    let eyeToSurfaceDir = normalize(i.worldPosition - cameraData.position);
    let direction = reflect(eyeToSurfaceDir, worldNormal);

    return textureSample(texture, textureSampler, direction);
}
