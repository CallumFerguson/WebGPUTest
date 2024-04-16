const PI = 3.14159265359;

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
    return vec4(integrateBRDF(i.uv.x, i.uv.y), 0, 1);
}

fn integrateBRDF(NdotV: f32, roughness: f32) -> vec2f {
    var V: vec3f;
    V.x = sqrt(1.0 - NdotV * NdotV);
    V.y = 0.0;
    V.z = NdotV;

    var A = 0.0;
    var B = 0.0;

    var N = vec3(0.0, 0.0, 1.0);

    const SAMPLE_COUNT: u32 = 1024;
    for(var i: u32 = 0; i < SAMPLE_COUNT; i++)
    {
        let Xi = hammersley(i, SAMPLE_COUNT);
        let H = importanceSampleGGX(Xi, N, roughness);
        let L = normalize(2.0 * dot(V, H) * H - V);

        let NdotL = max(L.z, 0.0);
        let NdotH = max(H.z, 0.0);
        let VdotH = max(dot(V, H), 0.0);

        if(NdotL > 0.0)
        {
            let G = geometrySmith(N, V, L, roughness);
            let G_Vis = (G * VdotH) / (NdotH * NdotV);
            let Fc = pow(1.0 - VdotH, 5.0);

            A += (1.0 - Fc) * G_Vis;
            B += Fc * G_Vis;
        }
    }
    A /= f32(SAMPLE_COUNT);
    B /= f32(SAMPLE_COUNT);
    return vec2(A, B);
}

fn radicalInverse_VdC(bits: u32) -> f32 {
    var bitsOut = bits;
    bitsOut = (bitsOut << 16u) | (bitsOut >> 16u);
    bitsOut = ((bitsOut & 0x55555555u) << 1u) | ((bitsOut & 0xAAAAAAAAu) >> 1u);
    bitsOut = ((bitsOut & 0x33333333u) << 2u) | ((bitsOut & 0xCCCCCCCCu) >> 2u);
    bitsOut = ((bitsOut & 0x0F0F0F0Fu) << 4u) | ((bitsOut & 0xF0F0F0F0u) >> 4u);
    bitsOut = ((bitsOut & 0x00FF00FFu) << 8u) | ((bitsOut & 0xFF00FF00u) >> 8u);
    return f32(bitsOut) * 2.3283064365386963e-10; // / 0x100000000
}

fn hammersley(i: u32, N: u32) -> vec2f {
    return vec2(f32(i) / f32(N), radicalInverse_VdC(i));
}

fn importanceSampleGGX(Xi: vec2f, N: vec3f, roughness: f32) -> vec3f{
    let a = roughness * roughness;

    let phi = 2.0 * PI * Xi.x;
    let cosTheta = sqrt((1.0 - Xi.y) / (1.0 + (a * a - 1.0) * Xi.y));
    let sinTheta = sqrt(1.0 - cosTheta * cosTheta);

    // from spherical coordinates to cartesian coordinates
    var H: vec3f;
    H.x = cos(phi) * sinTheta;
    H.y = sin(phi) * sinTheta;
    H.z = cosTheta;

    // from tangent-space vector to world-space sample vector
    let up = select(vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), abs(N.z) < 0.999);
    let tangent = normalize(cross(up, N));
    let bitangent = cross(N, tangent);

    let sampleVec = tangent * H.x + bitangent * H.y + N * H.z;
    return normalize(sampleVec);
}

fn geometrySmith(N: vec3f, V: vec3f, L: vec3f, roughness: f32) -> f32 {
    let NdotV = max(dot(N, V), 0.0);
    let NdotL = max(dot(N, L), 0.0);
    let ggx2 = geometrySchlickGGXForBRDF(NdotV, roughness);
    let ggx1 = geometrySchlickGGXForBRDF(NdotL, roughness);

    return ggx1 * ggx2;
}

fn geometrySchlickGGXForBRDF(NdotV: f32, roughness: f32) -> f32 {
  let a = roughness;
  let k = (a * a) / 2.0;

  let num = NdotV;
  let denom = NdotV * (1.0 - k) + k;

  return num / denom;
}
