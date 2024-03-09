@group(0) @binding(0) var texture: texture_2d<f32>;
@group(0) @binding(1) var textureSampler: sampler;

struct VertexInput {
    @builtin(vertex_index) vertexIndex: u32,
}

struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) uv: vec2f,
}

@vertex
fn vert(i: VertexInput) -> VertexOutput {
    let positions = array<vec2f, 3>(
      vec2f(-1, -1),
      vec2f(3, -1),
      vec2f(-1, 3),
    );
    let uvs = array<vec2f, 3>(
      vec2f(0, 1),
      vec2f(2, 1),
      vec2f(0, -1),
    );

    var o: VertexOutput;

    o.position = vec4(positions[i.vertexIndex], 0, 1);
    o.uv = uvs[i.vertexIndex];

    return o;
}

@fragment
fn frag(i: VertexOutput) -> @location(0) vec4f {
    var texel = textureSample(texture, textureSampler, i.uv);
    return brightnessToColor(texel.r);
}

fn brightnessToColor(brightness: f32) -> vec4<f32> {
    var clampedBrightness = clamp(brightness / 1000, 0.0, 1.0);

    let cold = vec3<f32>(0, 0, 0);
    let cool = vec3<f32>(1, 0, 0);
    let warm = vec3<f32>(1, 0.75, 0);
    let hot = vec3<f32>(0.9, 1, 1);
    let hottest = vec3<f32>(1, 1, 1);

    var color: vec3<f32>;
    if (clampedBrightness < 0.25) {
        color = mix(cold, cool, clampedBrightness * 4.0);
    } else if (clampedBrightness < 0.5) {
        color = mix(cool, warm, (clampedBrightness - 0.25) * 4.0);
    } else if (clampedBrightness < 0.75) {
        color = mix(warm, hot, (clampedBrightness - 0.5) * 4.0);
    } else {
        color = mix(hot, hottest, (clampedBrightness - 0.75) * 4.0);
    }

    return vec4<f32>(color, 1.0);
}
