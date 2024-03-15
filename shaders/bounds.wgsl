struct CameraData {
    view: mat4x4f,
    projection: mat4x4f,
}

struct SimulationInfo {
    boundsSize: vec3f,
    fixedDeltaTime: f32,
    boundsCenter: vec3f,
    workgroupCount: u32,
}

@group(0) @binding(0) var<uniform> cameraData: CameraData;
@group(0) @binding(1) var<uniform> simulationInfo: SimulationInfo;

struct VertexInput {
    @location(0) position: vec3f,
}

struct VertexOutput {
    @builtin(position) position: vec4f,
}

@vertex
fn vert(i: VertexInput) -> VertexOutput {
    var o: VertexOutput;

    o.position = cameraData.projection * cameraData.view * vec4(i.position * simulationInfo.boundsSize + simulationInfo.boundsCenter, 1);

    return o;
}

@fragment
fn frag(i: VertexOutput) -> @location(0) vec4f {
    return vec4(1, 1, 1, 1);
}
