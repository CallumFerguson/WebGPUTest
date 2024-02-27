struct UniformData {
    color: vec3f,
    mvp: mat4x4f,
    model: mat4x4f,
}

@group(0) @binding(0) var<uniform> u: UniformData;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var texture: texture_2d<f32>;

struct VertexInput {
    @location(0) position: vec4f,
    @location(1) normal: vec3f,
    @location(2) uv: vec2f,
}

struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) normal: vec3f,
    @location(1) uv: vec2f,
}

@vertex
fn vert(i: VertexInput) -> VertexOutput {
    var o: VertexOutput;
    o.position = u.mvp * i.position;
    o.normal = normalize((u.model * vec4(i.normal, 0.0)).xyz);
    o.uv = i.uv;
    return o;
}

@fragment
fn frag(i: VertexOutput) -> @location(0) vec4f {
    var light = min(max(dot(normalize(i.normal), normalize(vec3(-0.5, 0.5, 0.5))), 0) + 0.15, 1);
    var lightColor = vec3(light, light, light);
    var diffuseColor = textureSample(texture, textureSampler, i.uv).rgb;
    return vec4(diffuseColor * lightColor, 1);
}
