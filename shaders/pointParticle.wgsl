struct CameraData {
    view: mat4x4f,
    projection: mat4x4f,
    position: vec3f,
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
    o.brightness = (1 / (distance * distance)) * (881 / 100) * 4 * 2;

    return o;
}

@fragment
fn frag(i: VertexOutput) -> @location(0) f32 {
    return i.brightness;
}
