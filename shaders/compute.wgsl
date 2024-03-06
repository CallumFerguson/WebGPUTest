struct TimeData {
    deltaTime: f32,
}

@group(0) @binding(0) var<uniform> timeData: TimeData;

@group(1) @binding(0) var<storage, read_write> positions: array<vec3f>;
@group(1) @binding(1) var<storage, read_write> velocities: array<vec3f>;

@compute @workgroup_size(128) fn computeSomething(@builtin(global_invocation_id) id: vec3u) {
    let i = id.x;

    var gravityForceDirection = vec3(0, 0, -1) - positions[i];
    var gravityForceDirectionNormalized = normalize(gravityForceDirection);
    var distance = length(gravityForceDirection);

    var force = gravityForceDirectionNormalized / (distance * distance) * 1;

    velocities[i] += force * timeData.deltaTime;
//
    positions[i] += velocities[i] * timeData.deltaTime;

//    positions[i] += force * timeData.deltaTime;
}
