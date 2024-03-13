struct BodyInfo {
    position: vec3f,
    velocity: vec3f,
}

const fixedDeltaTime = 0.01;

@group(0) @binding(0) var<storage, read_write> bodyInfo: array<BodyInfo>;
@group(1) @binding(0) var<storage, read_write> bodyInfoNext: array<BodyInfo>;

@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) id: vec3u) {
    let i = id.x;

    bodyInfo[i].position.x += 0.5 * fixedDeltaTime;
//
//    velocities[i] += getGravityForce(vec3(0.05, -0.05, -1.5), id) * timeData.deltaTime;
//    velocities[i] += getGravityForce(vec3(-0.02, -0.04, -1), id) * timeData.deltaTime;
//    velocities[i] += getGravityForce(vec3(0.03, 0.01, -0.5), id) * timeData.deltaTime;
//
//    positions[i] += velocities[i] * timeData.deltaTime;
}

fn getGravityForce(position: vec3f, id: vec3u) -> vec3f {
//    let i = id.x;
//
//    var gravityForceDirection = position - positions[i];
//    var gravityForceDirectionNormalized = normalize(gravityForceDirection);
//    var distance = length(gravityForceDirection);
//
//    var force = gravityForceDirectionNormalized / (distance * distance);
//
//    return force;
    return vec3(0, 0, 0);
}
