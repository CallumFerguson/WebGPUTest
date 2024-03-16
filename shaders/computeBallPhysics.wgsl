struct SimulationInfo {
    boundsSize: vec3f,
    fixedDeltaTime: f32,
    boundsCenter: vec3f,
    workgroupCount: u32,
    collisionResolveStepMultiplier: f32,
    boundsRotation: mat4x4f,
    boundsRotationInverse: mat4x4f,
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
                    nextBody.velocity -= impulse * (1 / body.mass) * simulationInfo.collisionResolveStepMultiplier;
                }

                nextBody.position -= (toOther * ((body.radius + otherBody.radius) - distance) * 0.5) * simulationInfo.collisionResolveStepMultiplier;
            }
        }
    }

    body = nextBody;

    var boundsMin = -simulationInfo.boundsSize / 2;
    var boundsMax = simulationInfo.boundsSize / 2;

    var bodyLocalPosition = (simulationInfo.boundsRotationInverse * vec4(body.position - simulationInfo.boundsCenter, 1)).xyz;
    var newBodyLocalPosition = bodyLocalPosition;

    var bodyLocalVelocity = (simulationInfo.boundsRotationInverse * vec4(body.velocity, 1)).xyz;
    var newBodyLocalVelocity = bodyLocalVelocity;

    for (var i = 0; i < 3; i++) {
        // lower bounds
        var distInLowerBounds = -(bodyLocalPosition[i] - body.radius - boundsMin[i]);
        var inLowerBounds = step(0, distInLowerBounds);

        newBodyLocalPosition[i] += inLowerBounds * distInLowerBounds;

        var newVelocityForLowerCollision = -newBodyLocalVelocity[i] * body.restitution;
        newBodyLocalVelocity[i] += inLowerBounds * (newVelocityForLowerCollision - newBodyLocalVelocity[i]);

        // upper bounds
        var distInUpperBounds = bodyLocalPosition[i] + body.radius - boundsMax[i];
        var inUpperBounds = step(0, distInUpperBounds);

        newBodyLocalPosition[i] -= inUpperBounds * distInUpperBounds;

        var newVelocityForUpperCollision = -newBodyLocalVelocity[i] * body.restitution;
        newBodyLocalVelocity[i] += inUpperBounds * (newVelocityForUpperCollision - newBodyLocalVelocity[i]);
    }

    nextBody.position = (simulationInfo.boundsRotation * vec4(newBodyLocalPosition, 1)).xyz + simulationInfo.boundsCenter;
    nextBody.velocity = (simulationInfo.boundsRotation * vec4(newBodyLocalVelocity, 1)).xyz;

    nextBodies[bodyIndex] = nextBody;
}

fn getGravityForce(position: vec3f, gravityPosition: vec3f) -> vec3f {
    var gravityForceDirection = gravityPosition - position;
    var gravityForceDirectionNormalized = normalize(gravityForceDirection);
    var distance = length(gravityForceDirection);

    var force = gravityForceDirectionNormalized / (distance * distance);

    return force;
}
