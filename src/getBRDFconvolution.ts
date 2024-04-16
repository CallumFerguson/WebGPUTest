const distributionGGX = /* wgsl */ `
fn distributionGGX(n: vec3f, h: vec3f, roughness: f32) -> f32 {
  let a = roughness * roughness;
  let a2 = a * a;
  let nDotH = max(dot(n, h), 0.0);
  let nDotH2 = nDotH * nDotH;
  var denom = (nDotH2 * (a2 - 1.0) + 1.0);
  denom = PI * denom * denom;
  return a2 / denom;
}
`;

const geometrySchlickGGX = /* wgsl */ `
fn geometrySchlickGGX(nDotV: f32, roughness: f32) -> f32 {
  let r = (roughness + 1.0);
  let k = (r * r) / 8.0;
  return nDotV / (nDotV * (1.0 - k) + k);
}
`;

const geometrySmith = /* wgsl */ `
fn geometrySmith(n: vec3f, v: vec3f, l: vec3f, roughness: f32) -> f32 {
  let nDotV = max(dot(n, v), 0.0);
  let nDotL = max(dot(n, l), 0.0);
  let ggx2 = geometrySchlickGGX(nDotV, roughness);
  let ggx1 = geometrySchlickGGX(nDotL, roughness);
  return ggx1 * ggx2;
}
`;

const fresnelSchlick = /* wgsl */ `
fn fresnelSchlick(cosTheta: f32, f0: vec3f) -> vec3f {
  return f0 + (1.0 - f0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}
`;

const fresnelSchlickRoughness = /* wgsl */ `
fn fresnelSchlickRoughness(cosTheta: f32, f0: vec3f, roughness: f32) -> vec3f {
  return f0 + (max(vec3(1.0 - roughness), f0) - f0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}
`;

const radicalInverseVdC = /* wgsl */ `
// http://holger.dammertz.org/stuff/notes_HammersleyOnHemisphere.html
// efficient VanDerCorpus calculation.
fn radicalInverseVdC(bits: u32) -> f32 {
  var result = bits;
  result = (bits << 16u) | (bits >> 16u);
  result = ((result & 0x55555555u) << 1u) | ((result & 0xAAAAAAAAu) >> 1u);
  result = ((result & 0x33333333u) << 2u) | ((result & 0xCCCCCCCCu) >> 2u);
  result = ((result & 0x0F0F0F0Fu) << 4u) | ((result & 0xF0F0F0F0u) >> 4u);
  result = ((result & 0x00FF00FFu) << 8u) | ((result & 0xFF00FF00u) >> 8u);
  return f32(result) * 2.3283064365386963e-10;
}
`;

const hammersley = /* wgsl */ `
fn hammersley(i: u32, n: u32) -> vec2f {
  return vec2f(f32(i) / f32(n), radicalInverseVdC(i));
}
`;

const importanceSampleGGX = /* wgsl */ `
fn importanceSampleGGX(xi: vec2f, n: vec3f, roughness: f32) -> vec3f {
  let a = roughness * roughness;

  let phi = 2.0 * PI * xi.x;
  let cosTheta = sqrt((1.0 - xi.y) / (1.0 + (a * a - 1.0) * xi.y));
  let sinTheta = sqrt(1.0 - cosTheta * cosTheta);

  // from spherical coordinates to cartesian coordinates - halfway vector
  let h = vec3f(cos(phi) * sinTheta, sin(phi) * sinTheta, cosTheta);

  // from tangent-space H vector to world-space sample vector
  let up: vec3f = select(vec3f(1.0, 0.0, 0.0), vec3f(0.0, 0.0, 1.0), abs(n.z) < 0.999);
  let tangent = normalize(cross(up, n));
  let bitangent = cross(n, tangent);

  let sampleVec = tangent * h.x + bitangent * h.y + n * h.z;
  return normalize(sampleVec);
}
`;

const toneMappings = {
  reinhard: /* wgsl */ `
  fn toneMapping(color: vec3f) -> vec3f {
    return color / (color + vec3f(1.0));
  }
  `,
  uncharted2: /* wgsl */ `
  fn uncharted2Helper(x: vec3f) -> vec3f {
    let a = 0.15;
    let b = 0.50;
    let c = 0.10;
    let d = 0.20;
    let e = 0.02;
    let f = 0.30;

    return (x * (a * x + c * b) + d * e) / (x * (a * x + b) + d * f) - e / f;
  }

  fn toneMapping(color: vec3f) -> vec3f {
    let w = 11.2;
    let exposureBias = 2.0;
    let current = uncharted2Helper(exposureBias * color);
    let whiteScale = 1 / uncharted2Helper(vec3f(w));
    return current * whiteScale;
  }
  `,
  aces: /* wgsl */ `
  fn toneMapping(color: vec3f) -> vec3f {
    let a = 2.51;
    let b = 0.03;
    let c = 2.43;
    let d = 0.59;
    let e = 0.14;

    return (color * (a * color + b)) / (color * (c * color + d) + e);
  }
  `,
  lottes: /* wgsl */ `
  fn toneMapping(color: vec3f) -> vec3f {
    let a = vec3f(1.6);
    let d = vec3f(0.977);
    let hdrMax = vec3f(8.0);
    let midIn = vec3f(0.18);
    let midOut = vec3f(0.267);

    let b = (-pow(midIn, a) + pow(hdrMax, a) * midOut) / ((pow(hdrMax, a * d) - pow(midIn, a * d)) * midOut);
    let c = (pow(hdrMax, a * d) * pow(midIn, a) - pow(hdrMax, a) * pow(midIn, a * d) * midOut) / ((pow(hdrMax, a * d) - pow(midIn, a * d)) * midOut);

    return pow(color, a) / (pow(color, a * d) * b + c);
  }
  `,
};

function createBuffer(
  device: GPUDevice,
  array: Float32Array | Uint16Array,
  usage: number
) {
  // Align to 4 bytes.
  const buffer = device.createBuffer({
    size: (array.byteLength + 3) & ~3,
    usage,
    mappedAtCreation: true,
  });
  const writeArray =
    array instanceof Uint16Array
      ? new Uint16Array(buffer.getMappedRange())
      : new Float32Array(buffer.getMappedRange());
  writeArray.set(array);
  buffer.unmap();

  return buffer;
}

const vertexShader = /* wgsl */ `
struct VertexOutput {
  @builtin(position) Position: vec4f,
  @location(0) uv: vec2f,
}

@vertex
fn main(@location(0) position: vec3f, @location(1) uv: vec2f) -> VertexOutput {
  var output: VertexOutput;
  output.Position = vec4f(position, 1.0);
  output.uv = uv;
  return output;
}
`;

// https://learnopengl.com/code_viewer_gh.php?code=src/6.pbr/2.2.1.ibl_specular/2.2.1.brdf.fs
const fragmentShader = /* wgsl */ `
const PI: f32 = 3.14159265359;

${radicalInverseVdC}
${hammersley}
${importanceSampleGGX}
${geometrySmith}

// This one is different
fn geometrySchlickGGX(nDotV: f32, roughness: f32) -> f32 {
  let a = roughness;
  let k = (a * a) / 2.0;

  let nom = nDotV;
  let denom = nDotV * (1.0 - k) + k;

  return nom / denom;
}

fn integrateBRDF(NdotV: f32, roughness: f32) -> vec2f {
  var V: vec3f;
  V.x = sqrt(1.0 - NdotV * NdotV);
  V.y = 0.0;
  V.z = NdotV;

  var A: f32 = 0.0;
  var B: f32 = 0.0;

  let N = vec3f(0.0, 0.0, 1.0);

  let SAMPLE_COUNT: u32 = 1024u;
  for(var i: u32 = 0u; i < SAMPLE_COUNT; i = i + 1u) {
      let Xi: vec2f = hammersley(i, SAMPLE_COUNT);
      let H: vec3f = importanceSampleGGX(Xi, N, roughness);
      let L: vec3f = normalize(2.0 * dot(V, H) * H - V);

      let NdotL: f32 = max(L.z, 0.0);
      let NdotH: f32 = max(H.z, 0.0);
      let VdotH: f32 = max(dot(V, H), 0.0);

      if(NdotL > 0.0) {
          let G: f32 = geometrySmith(N, V, L, roughness);
          let G_Vis: f32 = (G * VdotH) / (NdotH * NdotV);
          let Fc: f32 = pow(1.0 - VdotH, 5.0);

          A += (1.0 - Fc) * G_Vis;
          B += Fc * G_Vis;
      }
  }
  A /= f32(SAMPLE_COUNT);
  B /= f32(SAMPLE_COUNT);
  return vec2f(A, B);
}

@fragment
fn main(@location(0) uv: vec2f) -> @location(0) vec2f {
  let result = integrateBRDF(uv.x, 1 - uv.y);
  return result;
}
`;

// prettier-ignore
export const quadVertices = new Float32Array([
  -1.0, -1.0, 0.0, 0.0, 0.0,
  1.0, -1.0, 0.0, 1.0, 0.0,
  1.0, 1.0, 0.0, 1.0, 1.0,
  -1.0, -1.0, 0.0, 0.0, 0.0,
  1.0, 1.0, 0.0, 1.0, 1.0,
  -1.0, 1.0, 0.0, 0.0, 1.0
]);

export function getBRDFConvolutionLUT(device: GPUDevice, size: number) {
  const texture = device.createTexture({
    label: "BRDF LUT",
    size: { width: size, height: size },
    format: "rg16float",
    usage:
      GPUTextureUsage.RENDER_ATTACHMENT |
      GPUTextureUsage.TEXTURE_BINDING |
      GPUTextureUsage.COPY_DST,
  });

  const pipeline = device.createRenderPipeline({
    label: "BRDF convolution",
    layout: "auto",
    vertex: {
      module: device.createShaderModule({ code: vertexShader }),
      entryPoint: "main",
      buffers: [
        {
          arrayStride: Float32Array.BYTES_PER_ELEMENT * 5,
          attributes: [
            {
              shaderLocation: 0,
              offset: 0,
              format: "float32x3",
            },
            {
              shaderLocation: 1,
              offset: Float32Array.BYTES_PER_ELEMENT * 3,
              format: "float32x2",
            },
          ],
        },
      ],
    },
    fragment: {
      module: device.createShaderModule({ code: fragmentShader }),
      entryPoint: "main",
      targets: [{ format: "rg16float" }],
    },
    primitive: {
      topology: "triangle-list",
    },
    depthStencil: {
      format: "depth24plus",
      depthWriteEnabled: true,
      depthCompare: "less",
    },
  });

  const depthTexture = device.createTexture({
    label: "BRDF LUT depth",
    size: { width: size, height: size },
    format: "depth24plus",
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });

  const depthTextureView = depthTexture.createView();

  const vertexBuffer = createBuffer(
    device,
    quadVertices,
    GPUBufferUsage.VERTEX
  );

  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginRenderPass({
    colorAttachments: [
      {
        view: texture.createView(),
        clearValue: { r: 0, g: 0, b: 0, a: 1 },
        loadOp: "clear",
        storeOp: "store",
      },
    ],
    depthStencilAttachment: {
      view: depthTextureView,
      depthClearValue: 1.0,
      depthLoadOp: "clear",
      depthStoreOp: "store",
    },
  });

  passEncoder.setPipeline(pipeline);
  passEncoder.setVertexBuffer(0, vertexBuffer);
  passEncoder.draw(6);
  passEncoder.end();

  device.queue.submit([commandEncoder.finish()]);

  return texture;
}
