struct CameraData {
    view: mat4x4f,
    projection: mat4x4f,
    position: vec3f,
    viewDirectionProjectionInverse: mat4x4f,
}

struct Body {
    position: vec3f,
    radius: f32,
    velocity: vec3f,
    restitution: f32,
    color: vec3f,
    mass: f32,
}

@group(0) @binding(0) var<uniform> cameraData: CameraData;

@group(1) @binding(0) var<storage, read> bodies: array<Body>;

struct VertexInput {
    @builtin(instance_index) instanceIndex: u32,
    @location(0) position: vec3f,
    @location(1) normal: vec3f,
}

struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) normal: vec3f,
    @location(1) color: vec3f,
}

@vertex
fn vert(i: VertexInput) -> VertexOutput {
    var body = bodies[i.instanceIndex];

    var o: VertexOutput;

    o.position = cameraData.projection * cameraData.view * vec4(i.position * 0.5 * body.radius * 2 + body.position, 1);
    o.normal = i.normal;
    o.color = body.color;

    return o;
}

@fragment
fn frag(i: VertexOutput) -> @location(0) vec4f {
    var normal = normalize(i.normal);
    var light = dot(normal, normalize(vec3(-1, 1, 1)));
    light = clamp(light, 0.5, 1);
    return vec4(i.color * light, 1);
}
