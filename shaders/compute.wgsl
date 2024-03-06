struct UniformData {
    position: vec3f,
    velocity: vec3f,
}

struct TimeData {
    deltaTime: f32,
}

@group(0) @binding(0) var<storage, read_write> uniformData: array<UniformData>;
@group(1) @binding(0) var<uniform> timeData: TimeData;

@compute @workgroup_size(64) fn computeSomething(@builtin(global_invocation_id) id: vec3u) {
    let i = id.x;
    uniformData[i].position += uniformData[i].velocity * timeData.deltaTime;
}
