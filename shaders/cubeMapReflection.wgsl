struct CameraData {
    view: mat4x4f,
    projection: mat4x4f,
    position: vec3f,
    viewDirectionProjectionInverse: mat4x4f,
}

struct ObjectData {
    model: mat4x4f,
}

@group(0) @binding(0) var texture: texture_cube<f32>;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var<uniform> cameraData: CameraData;
@group(0) @binding(3) var normalTexture: texture_2d<f32>;

@group(1) @binding(0) var<uniform> objectData: ObjectData;

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
    @location(1) worldNormal: vec3f,
    @location(2) uv: vec2f,
}

@vertex
fn vert(i: VertexInput) -> VertexOutput {
    var o: VertexOutput;

    o.position = cameraData.projection * cameraData.view * objectData.model * i.position;
    o.worldPosition = (objectData.model * i.position).xyz;
    o.worldNormal = (objectData.model * vec4(i.normal, 0)).xyz;
    o.uv = i.uv;

    return o;
}

@fragment
fn frag(i: VertexOutput) -> @location(0) vec4f {
//    let textureNormal = normalize(textureSample(normalTexture, textureSampler, i.uv).xyz * 2 - 1);

//    let worldNormal = normalize(i.worldNormal);
//    let eyeToSurfaceDir = normalize(i.worldPosition - cameraData.position);
//    var direction = reflect(eyeToSurfaceDir, worldNormal);

//    const randomMagnitude = 0.025;
//    const halfRandomMagnitude = randomMagnitude / 2;
//    direction.x += rand(direction.xy) * randomMagnitude - halfRandomMagnitude;
//    direction.y += rand(direction.yz) * randomMagnitude - halfRandomMagnitude;
//    direction.z += rand(direction.zx) * randomMagnitude - halfRandomMagnitude;

//    direction += textureNormal;

//    let reflectionColor = textureSample(texture, textureSampler, direction * vec3(-1, 1, 1)).rgb;
//
//    return vec4(reflectionColor * vec3(0.7, 0.7, 0.65), 1);

//    var light = dot(worldNormal, normalize(-vec3(-1, -1, 0)));
//    return vec4(light, light, light, 1);
    return vec4(i.worldNormal + 1 * 0.5, 1);
}

fn rand(co: vec2f) -> f32 {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}
