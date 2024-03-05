struct UniformData {
    model: mat4x4f,
}

@group(0) @binding(0) var<uniform> viewProjection: mat4x4f;
@group(0) @binding(1) var texture: texture_2d<f32>;
@group(0) @binding(2) var textureSampler: sampler;

@group(1) @binding(0) var<storage, read> uniformData: array<UniformData>;

struct VertexInput {
    @builtin(instance_index) instanceIndex: u32,
    @location(0) position: vec4f,
    @location(1) normal: vec3f,
    @location(2) uv: vec2f,
}

struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) normal: vec3f,
    @location(1) uv: vec2f,
    @location(2) @interpolate(flat) instanceIndex: u32,
}

@vertex
fn vert(i: VertexInput) -> VertexOutput {
    var uniformData = uniformData[i.instanceIndex];

    var o: VertexOutput;
    o.position = viewProjection * uniformData.model * i.position;
    o.normal = normalize((uniformData.model * vec4(i.normal, 0.0)).xyz);
    o.uv = i.uv;
    o.instanceIndex = i.instanceIndex;
    return o;
}

@fragment
fn frag(i: VertexOutput) -> @location(0) vec4f {
    var light = min(max(dot(normalize(i.normal), normalize(vec3(-0.5, 0.5, 0.5))), 0) + 0.15, 1);
    var lightColor = vec3(light, light, light);
    var diffuseColor = textureSample(texture, textureSampler, i.uv).rgb;
    return vec4(diffuseColor * lightColor, 1); // * ua[i.instanceIndex].color
}
