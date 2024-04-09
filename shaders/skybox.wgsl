@group(0) @binding(0) var texture: texture_cube<f32>;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var<uniform> cameraData: CameraData;

struct VertexInput {
    @builtin(vertex_index) vertexIndex: u32,
}

struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) pos: vec4f,
}

@vertex
fn vert(i: VertexInput) -> VertexOutput {
    let positions = array<vec2f, 3>(
      vec2f(-1, 3),
      vec2f(-1,-1),
      vec2f( 3,-1),
    );

    var o: VertexOutput;

    o.position = vec4(positions[i.vertexIndex], 1, 1);
    o.pos = o.position;

    return o;
}

@fragment
fn frag(i: VertexOutput) -> @location(0) vec4f {
    let t = cameraData.viewDirectionProjectionInverse * i.pos;
    var color = textureSample(texture, textureSampler, normalize(t.xyz / t.w) * vec3f(-1, 1, 1)).rgb;

    const gamma: f32 = 2.2;
    const exposure: f32 = 1;
    color = vec3(1.0) - exp(-color * exposure);
    color = pow(color, vec3(1.0 / gamma));

    return vec4(color, 1);
}
