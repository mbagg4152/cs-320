let can1 = elem('canvas1'), can2 = elem('canvas2'), can3 = elem('canvas3'), can4 = elem('canvas4'), shift_x = 0.0,
    shift_y = 0.0, shift_z = 0.0;
let attr_pos, gl1, gl2, gl3, gl4, pts_circle, pts_ellipse, uni_color, uni_trans, v_count;

function main() {
    pts_circle = make_round_points('C', 0, 0);
    pts_ellipse = make_round_points('E', 0.6, 0.4);
    config_draw(gl1, 'E', can1, make_vec4_color(dark_red), src_vert, src_frag);
    config_draw(gl2, 'T', can2, make_vec4_color(dark_blue), src_vert, src_frag);
    config_draw(gl3, 'C', can3, make_vec4_color(dark_green), src_vert, src_frag);
    config_draw(gl4, 'S', can4, make_vec4_color(black), src_vert, src_frag);
}

function config_draw(gl, shape, canvas, color_vals, v_shader, f_shader) {
    try { gl = getWebGLContext(canvas); } catch (e) { alert(e); }
    try { initShaders(gl, v_shader, f_shader); } catch (e) { alert(e); }
    try { v_count = initVertexBuffers(gl, shape); } catch (e) { alert(e); }
    try { uni_trans = gl.getUniformLocation(gl.program, 'u_trans'); } catch (e) { alert(e); }
    try { uni_color = gl.getUniformLocation(gl.program, 'l_color'); } catch (e) { alert(e); }

    gl.uniform4f(uni_trans, shift_x, shift_y, shift_z, 0.0);
    gl.uniform4f(uni_color, color_vals[0], color_vals[1], color_vals[2], color_vals[3]);
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (shape === 'S') gl.drawArrays(gl.TRIANGLE_STRIP, 0, v_count);
    else if (shape === 'T') gl.drawArrays(gl.TRIANGLES, 0, v_count);
    else if (shape === 'C' || shape === 'E') gl.drawArrays(gl.TRIANGLE_STRIP, 0, v_count);
}

function make_round_points(shape, a, b) {
    let verts = [];
    for (let i = 0.0; i <= 360.0; i += 1) {
        let pt = (i * Math.PI) / 180;
        if (shape === 'C') verts = verts.concat([Math.cos(pt) / 2, Math.sin(pt) / 2, 0, 0]);
        if (shape === 'E') verts = verts.concat([(a * Math.cos(pt)), (b * Math.sin(pt)), 0, 0]);
    }

    return verts;
}

function initVertexBuffers(gl, shape) {
    let n = -1, verts;
    if (shape === 'T') {
        n = 3;
        verts = new Float32Array(pts_triangle);
    } else if (shape === 'S') {
        n = 6;
        verts = new Float32Array(pts_square);
    } else if (shape === 'C') {
        n = pts_circle.length / 2;
        verts = new Float32Array(pts_circle);
    } else if (shape === 'E') {
        n = pts_ellipse.length / 2;
        verts = new Float32Array(pts_ellipse);
    }
    let vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) alert('Failed to create the buffer object');
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    attr_pos = gl.getAttribLocation(gl.program, 'a_pos');
    if (attr_pos < 0) alert('Failed to get the storage location of a_pos');
    gl.vertexAttribPointer(attr_pos, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attr_pos);

    return n;
}