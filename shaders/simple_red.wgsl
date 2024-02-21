@vertex
fn vert(@location(0) position: vec3f) -> @builtin(position) vec4f {
    return vec4(position * 0.03, 1.0);
}

@fragment
fn frag() -> @location(0) vec4f {
    return vec4f(1.0, 0, 0, 1.0);
}
