struct SimulationInfo {
    boundsSize: vec3f,
    fixedDeltaTime: f32,
    boundsCenter: vec3f,
    workgroupCount: u32,
}

struct Body {
    position: vec3f,
    radius: f32,
    velocity: vec3f,
    restitution: f32,
    color: vec3f,
    mass: f32,
}

@group(0) @binding(0) var<uniform> simulationInfo: SimulationInfo;
@group(1) @binding(0) var<storage, read> bodies: array<Body>;
@group(2) @binding(0) var<storage, read_write> nextBodies: array<Body>;

@compute @workgroup_size(64) fn applyVelocity(@builtin(global_invocation_id) id: vec3u) {
    let bodyIndex = id.x;

    var body = bodies[bodyIndex];
    var nextBody = body;

    nextBody.velocity.y -= 9.8 * simulationInfo.fixedDeltaTime;

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
            if (distance < body.radius + otherBody.radius) {
                var normal = toOther / distance;
                var relativeVelocity = otherBody.velocity - body.velocity;
                var velocityAlongNormal = dot(relativeVelocity, normal);

                if (velocityAlongNormal <= 0) {
                    var restitution = min(body.restitution, otherBody.restitution);

                    // calculate impulse scalar
                    var j = -(1 + restitution) * velocityAlongNormal;
                    j /= 1 / body.mass + 1 / otherBody.mass;
                    j /= 2;

                    var impulse = normal * j;
                    nextBody.velocity -= impulse * (1 / body.mass);
                }

                nextBody.position -= toOther * ((body.radius + otherBody.radius) - distance) * 0.5;
            }
        }
    }

    var boundsMin = simulationInfo.boundsCenter - simulationInfo.boundsSize / 2;
    var boundsMax = simulationInfo.boundsCenter + simulationInfo.boundsSize / 2;

    for (var i = 0; i < 3; i++) {
        var distInLowerBounds = -(body.position[i] - body.radius - boundsMin[i]);
        var inLowerBounds = step(0, distInLowerBounds);
        nextBody.position[i] += inLowerBounds * distInLowerBounds;
        nextBody.velocity[i] += inLowerBounds * ((-nextBody.velocity[i] * body.restitution) - nextBody.velocity[i]);

        if (i != 1) {
            var distInUpperBounds = body.position[i] + body.radius - boundsMax[i];
            var inUpperBounds = step(0, distInUpperBounds);
            nextBody.position[i] -= inUpperBounds * distInUpperBounds;
            nextBody.velocity[i] += inUpperBounds * ((-nextBody.velocity[i] * body.restitution) - nextBody.velocity[i]);
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
