struct SimulationInfo {
    fixedDeltaTime: f32,
    workgroupCount: u32,
}

struct Body {
    position: vec3f,
    velocity: vec3f,
}

const radius = 0.12;

@group(0) @binding(0) var<uniform> simulationInfo: SimulationInfo;
@group(1) @binding(0) var<storage, read> bodies: array<Body>;
@group(2) @binding(0) var<storage, read_write> nextBodies: array<Body>;

@compute @workgroup_size(64) fn applyVelocity(@builtin(global_invocation_id) id: vec3u) {
    let bodyIndex = id.x;

    var body = bodies[bodyIndex];
    var nextBody = body;

//    nextBody.velocity.y -= 9.8 * simulationInfo.fixedDeltaTime;

    for (var i = 0u; i < 64; i++) {
        if (i != bodyIndex) {
            var otherBody = bodies[i];
            nextBody.velocity += getGravityForce(body.position, otherBody.position) * simulationInfo.fixedDeltaTime * 1;
        }
    }

    nextBody.position += nextBody.velocity * simulationInfo.fixedDeltaTime;

    nextBodies[bodyIndex] = nextBody;
}

@compute @workgroup_size(64) fn handleCollisions(@builtin(global_invocation_id) id: vec3u) {
    let bodyIndex = id.x;

    var body = bodies[bodyIndex];
    var nextBody = body;

    for (var i = 0u; i < 64 * simulationInfo.workgroupCount; i++) {
        if (i != bodyIndex) {
            var otherBody = bodies[i];
            var toOther = otherBody.position - body.position;
            var distance = length(toOther);
            if (distance < radius * 2) {
                var normal = toOther / distance;
                var relativeVelocity = otherBody.velocity - body.velocity;
                var velocityAlongNormal = dot(relativeVelocity, normal);

                if (velocityAlongNormal <= 0) {
                    var restitution = 0.0; // min(r1, r2);

                    // calculate impulse scalar
                    var j = -(1 + restitution) * velocityAlongNormal;
//                    j /= 1 / b1.mass + 1 / b2.mass;
                    j /= 2;

                    var impulse = normal * j;
                    nextBody.velocity -= impulse; // * (1 / nextBody.mass);
                }

                nextBody.position -= toOther * (radius * 2 - distance) * 0.5;
            }
        }
    }

    nextBodies[bodyIndex] = nextBody;
}

fn getGravityForce(position: vec3f, gravityPosition: vec3f) -> vec3f {
    var gravityForceDirection = gravityPosition - position;
    var gravityForceDirectionNormalized = normalize(gravityForceDirection);
    var distance = length(gravityForceDirection);

    var force = gravityForceDirectionNormalized / (distance * distance);

    return force;
}
