struct TimeData {
    deltaTime: f32,
}

@group(0) @binding(0) var<uniform> timeData: TimeData;

@group(1) @binding(0) var<storage, read_write> positions: array<vec3f>;
@group(1) @binding(1) var<storage, read_write> velocities: array<vec3f>;

@compute @workgroup_size(128) fn computeSomething(@builtin(global_invocation_id) id: vec3u) {
    let i = id.x;

    velocities[i] += getGravityForce(vec3(0.05, -0.05, -0.5), id) * timeData.deltaTime;
    velocities[i] += getGravityForce(vec3(-0.02, -0.04, 0), id) * timeData.deltaTime;
    velocities[i] += getGravityForce(vec3(0.03, 0.01, 0.5), id) * timeData.deltaTime;

    positions[i] += velocities[i] * timeData.deltaTime;
}

fn getGravityForce(position: vec3f, id: vec3u) -> vec3f {
    let i = id.x;

    var gravityForceDirection = position - positions[i];
    var gravityForceDirectionNormalized = normalize(gravityForceDirection);
    var distance = length(gravityForceDirection);

    var force = gravityForceDirectionNormalized / (distance * distance);

    return force;
}