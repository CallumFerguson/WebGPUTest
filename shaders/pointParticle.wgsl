struct CameraData {
    view: mat4x4f,
    projection: mat4x4f,
//    screenHeight
}

@group(0) @binding(0) var<uniform> cameraData: CameraData;

@group(1) @binding(0) var<storage, read> positions: array<vec3f>;

struct VertexInput {
    @builtin(vertex_index) vertexIndex: u32,
}

struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) brightness: f32,
}

@vertex
fn vert(i: VertexInput) -> VertexOutput {
    var o: VertexOutput;

    var viewPosition = cameraData.view * vec4(positions[i.vertexIndex], 1);

    o.position = cameraData.projection * viewPosition;

    var distance = length(viewPosition);
    o.brightness = (1 / (distance * distance)) * 10;

    return o;
}

@fragment
fn frag(i: VertexOutput) -> @location(0) vec4f {
//    return vec4(vec3(0.1, 0.025, 0.005) * 1, 1);
    return vec4(i.brightness, 0, 0, 1);
}
