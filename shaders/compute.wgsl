struct UniformData {
    position: vec3f,
    velocity: vec3f,
}

@group(0) @binding(0) var<storage, read_write> uniformData: array<UniformData>;

@compute @workgroup_size(64) fn computeSomething(@builtin(global_invocation_id) id: vec3u) {
    let i = id.x;
    uniformData[i].position += uniformData[i].velocity * 0.01;
}
