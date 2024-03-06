struct UniformData {
    model: mat4x4f,
    velocity: vec3f,
}

@group(0) @binding(0) var<storage, read_write> uniformData: array<UniformData>;

@compute @workgroup_size(1) fn computeSomething(@builtin(global_invocation_id) id: vec3u) {
    let i = id.x;
    uniformData[i].model[3][0] += uniformData[i].velocity.x * 0.005;
    uniformData[i].model[3][1] += uniformData[i].velocity.y * 0.005;
    uniformData[i].model[3][2] += uniformData[i].velocity.z * 0.005;
}
