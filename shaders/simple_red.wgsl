struct UniformData {
    color: vec3f,
}

@group(0) @binding(0) var<uniform> uniformData: UniformData;

struct VertexInput {
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
    o.position = vec4(i.position.xyz * 0.03, 1.0) - vec4(0, 0.25, 0, 0);
    o.normal = i.normal;
    return o;
}

@fragment
fn frag(i: VertexOutput) -> @location(0) vec4f {
    var light = dot(i.normal, normalize(vec3(-0.5, 0.5, 0.5)));
    var lightColor = vec3(light, light, light);
    return vec4f(lightColor * uniformData.color, 1.0);
}
