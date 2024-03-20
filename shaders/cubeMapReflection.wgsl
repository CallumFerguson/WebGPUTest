struct CameraData {
    view: mat4x4f,
    projection: mat4x4f,
    position: vec3f,
    viewDirectionProjectionInverse: mat4x4f,
}

struct ObjectData {
    model: mat4x4f,
}

@group(0) @binding(0) var texture: texture_cube<f32>;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var<uniform> cameraData: CameraData;

@group(1) @binding(0) var<uniform> objectData: ObjectData;

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

    o.position = cameraData.projection * cameraData.view * objectData.model * i.position;
    o.worldPosition = (objectData.model * i.position).xyz;
    o.worldNormal = (objectData.model * vec4(i.normal, 0)).xyz;

    return o;
}

@fragment
fn frag(i: VertexOutput) -> @location(0) vec4f {
    let worldNormal = normalize(i.worldNormal);
    let eyeToSurfaceDir = normalize(i.worldPosition - cameraData.position);
    let direction = reflect(eyeToSurfaceDir, worldNormal);

    return textureSample(texture, textureSampler, direction * vec3(-1, 1, 1));
}
