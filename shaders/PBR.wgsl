struct ObjectData {
    model: mat4x4f,
}

@group(0) @binding(0) var<uniform> cameraData: CameraData;

@group(1) @binding(0) var textureSampler: sampler;
@group(1) @binding(1) var albedoTexture: texture_2d<f32>;
@group(1) @binding(2) var emissionTexture: texture_2d<f32>;
@group(1) @binding(3) var normalTexture: texture_2d<f32>;
@group(1) @binding(4) var occlusionRoughnessMetalicTexture: texture_2d<f32>;
@group(1) @binding(5) var environmentCubeMapTexture: texture_cube<f32>;

@group(2) @binding(0) var<uniform> objectData: ObjectData;

struct VertexInput {
    @location(0) position: vec4f,
    @location(1) normal: vec3f,
    @location(2) uv: vec2f,
    @location(3) tangent: vec3f,
    @location(4) bitangent: vec3f,
}

struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) worldPosition: vec3f,
    @location(1) uv: vec2f,
    @location(2) tangnet: vec3f,
    @location(3) bitangent: vec3f,
    @location(4) normal: vec3f,
}

@vertex
fn vert(i: VertexInput) -> VertexOutput {
    var o: VertexOutput;

    o.position = cameraData.projection * cameraData.view * objectData.model * i.position;
    o.worldPosition = (objectData.model * i.position).xyz;
    o.uv = i.uv;
    o.tangnet = normalize((objectData.model * vec4(i.tangent, 0)).xyz);
    o.bitangent = normalize((objectData.model * vec4(i.bitangent, 0)).xyz);
    o.normal = normalize((objectData.model * vec4(i.normal, 0)).xyz);

    return o;
}

@fragment
fn frag(i: VertexOutput) -> @location(0) vec4f {
    const gamma = 2.2;

    let albedo = pow(textureSample(albedoTexture, textureSampler, i.uv).rgb, vec3(gamma));

    let emission = textureSample(emissionTexture, textureSampler, i.uv).rgb;
    let occlusionRoughnessMetalic = textureSample(occlusionRoughnessMetalicTexture, textureSampler, i.uv).rgb;

    let TBN = mat3x3(i.tangnet, i.bitangent, i.normal);
    let textureNormal = textureSample(normalTexture, textureSampler, i.uv).rgb * 2 - 1;
    let worldNormal = normalize(TBN * textureNormal);

    let eyeToSurfaceDir = normalize(i.worldPosition - cameraData.position);
    var reflectionDirection = reflect(eyeToSurfaceDir, worldNormal);

    let reflectionColor = textureSample(environmentCubeMapTexture, textureSampler, reflectionDirection * vec3(-1, 1, 1)).rgb;

    var light = dot(worldNormal, normalize(-vec3(-1, -1, 0)));
    light = clamp(light, 0.05, 1);
    light = min(light, occlusionRoughnessMetalic.r);
    var fragColor = albedo * reflectionColor * light;
    fragColor += emission;

//    return vec4(pow(fragColor.rgb, vec3(1.0/gamma)), 1);

//    let viewNormal = cameraData.view * vec4(worldNormal, 0);

    let r = vec3(1.0, 0.71, 0.29);
    var a = 1 - dot(worldNormal, -eyeToSurfaceDir);
    a = pow(a, 5);
    let b = r + (1 - r) * a;
    return vec4(mix(albedo, reflectionColor, b), 1);
}

//fn rand(co: vec2f) -> f32 {
//    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
//}
//    const randomMagnitude = 0.025;
//    const halfRandomMagnitude = randomMagnitude / 2;
//    direction.x += rand(direction.xy) * randomMagnitude - halfRandomMagnitude;
//    direction.y += rand(direction.yz) * randomMagnitude - halfRandomMagnitude;
//    direction.z += rand(direction.zx) * randomMagnitude - halfRandomMagnitude;