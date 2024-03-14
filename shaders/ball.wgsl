struct CameraData {
    view: mat4x4f,
    projection: mat4x4f,
}

struct BodyInfo {
    position: vec3f,
    velocity: vec3f,
}

const radius = 0.12;

@group(0) @binding(0) var<uniform> cameraData: CameraData;

@group(1) @binding(0) var<storage, read> bodyInfo: array<BodyInfo>;

struct VertexInput {
    @builtin(instance_index) instanceIndex: u32,
    @location(0) position: vec3f,
    @location(1) normal: vec3f,
}

struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) normal: vec3f,
}

@vertex
fn vert(i: VertexInput) -> VertexOutput {
    var o: VertexOutput;

    o.position = cameraData.projection * cameraData.view * vec4(i.position * 0.5 * radius * 2 + bodyInfo[i.instanceIndex].position, 1);
    o.normal = i.normal;

    return o;
}

@fragment
fn frag(i: VertexOutput) -> @location(0) vec4f {
    var normal = normalize(i.normal);
    var light = dot(normal, normalize(vec3(-1, 1, 1)));
    light = clamp(light, 0.1, 1);
    var color = vec3f(1, 1, 0.5);
    return vec4(color * light, 1);
}
