struct UniformData {
    color: vec3f,
    mvp: mat4x4f,
    model: mat4x4f,
}

@group(0) @binding(0) var<uniform> u: UniformData;

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
    o.position = u.mvp * vec4(i.position.xyz, 1.0);
    o.normal = (u.model * vec4(i.normal, 0.0)).xyz;
    return o;
}

@fragment
fn frag(i: VertexOutput) -> @location(0) vec4f {
    var light = min(max(dot(normalize(i.normal), normalize(vec3(-0.5, 0.5, 0.5))), 0) + 0.15, 1);
    var lightColor = vec3(light, light, light);
    return vec4f(lightColor * u.color, 1.0);
}
