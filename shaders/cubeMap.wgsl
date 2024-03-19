struct CameraData {
    view: mat4x4f,
    projection: mat4x4f,
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
    @location(0) normal: vec3f,
}

@vertex
fn vert(i: VertexInput) -> VertexOutput {
    var o: VertexOutput;

    o.position = cameraData.projection * cameraData.view * i.position;
    o.normal = normalize(i.position.xyz);
//    o.normal = (cameraData.view * vec4(0, 0, -1, 0)).xyz;

    return o;
}

@fragment
fn frag(i: VertexOutput) -> @location(0) vec4f {
    return textureSample(texture, textureSampler, normalize(i.normal));
}
