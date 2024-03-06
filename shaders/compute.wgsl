struct TimeData {
    deltaTime: f32,
}

@group(0) @binding(0) var<uniform> timeData: TimeData;

@group(1) @binding(0) var<storage, read_write> positions: array<vec3f>;
@group(1) @binding(1) var<storage, read_write> velocities: array<vec3f>;

@compute @workgroup_size(128) fn computeSomething(@builtin(global_invocation_id) id: vec3u) {
    let i = id.x;
    positions[i] += velocities[i] * timeData.deltaTime;
}
