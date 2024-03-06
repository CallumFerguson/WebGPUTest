struct CameraData {
    view: mat4x4f,
    projection: mat4x4f,
}

@group(0) @binding(0) var<uniform> cameraData: CameraData;

@group(1) @binding(0) var<storage, read> positions: array<vec3f>;

struct VertexInput {
    @builtin(vertex_index) vertexIndex: u32,
}

struct VertexOutput {
    @builtin(position) position: vec4f,
}

@vertex
fn vert(i: VertexInput) -> VertexOutput {
    var o: VertexOutput;

    o.position = cameraData.projection * cameraData.view * vec4(positions[i.vertexIndex], 1);

    return o;
}

@fragment
fn frag(i: VertexOutput) -> @location(0) vec4f {
    return vec4(1, 0.15, 0, 1);
}
