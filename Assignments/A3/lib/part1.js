let can1 = elem('canvas1'), can2 = elem('canvas2'), can3 = elem('canvas3'), can4 = elem('canvas4'), shift_x = 0.0,
    shift_y = 0.0, shift_z = 0.0;
let attr_color, attr_pos, gl1, gl2, gl3, gl4, pts_circle, pts_ellipse, uni_color, uni_trans, v_count, var_color;

function main() {
    pts_circle = make_round_points('C', 0, 0);
    pts_ellipse = make_round_points('E', 0.6, 0.4);
    config_draw(gl1, 'E', can1, make_vec4_color(dark_red), src_vert, src_frag, false);
    if (src_frag_tri === null || src_frag_tri === undefined) alert('triangle frag shader is null :(');
    config_draw(gl2, 'T', can2, make_vec4_color(dark_blue), src_grad_vert, src_grad_frag, true);
    config_draw(gl3, 'C', can3, make_vec4_color(dark_green), src_vert, src_frag, false);
    config_draw(gl4, 'S', can4, make_vec4_color(black), src_vert, src_frag, false);
}

function config_draw(gl, shape, canvas, color_vals, v_shader, f_shader, grad) {
    try { gl = getWebGLContext(canvas); } catch (e) { alert('CTX ERR\n' + e); }
    if (f_shader === null || f_shader === undefined || !f_shader) clog('frag shader is null/undefined :(');
    try { initShaders(gl, v_shader, f_shader, grad); } catch (e) { clog('SHADER ERR\n' + e); }
    try { v_count = init_buffers(gl, shape); } catch (e) { clog('VBUFF ERR\n' + e); }
    try { uni_trans = gl.getUniformLocation(gl.program, 'u_trans'); } catch (e) { clog('TRANS ERR\n' + e); }
    if (shape !== 'T') {
        try { uni_color = gl.getUniformLocation(gl.program, 'l_color'); } catch (e) { clog('COLOR ERR\n' + e); }
        gl.uniform4f(uni_color, color_vals[0], color_vals[1], color_vals[2], color_vals[3]);
    }

    gl.uniform4f(uni_trans, shift_x, shift_y, shift_z, 0.0);
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

function init_buffers(gl, shape, grad) {
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

    if (grad) {
        let vert_buff = make_buff(gl, gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
        let color_buff = gl.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(tri_colors), gl.STATIC_DRAW);
        let index_buff = gl.createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tri_indices), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, vert_buff);
        try { attr_pos = gl.getAttribLocation(gl.program, 'a_pos'); } catch (e) { clog('POS ERR\n' + e); }
        gl.vertexAttribPointer(attr_pos, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attr_pos);

        gl.bindBuffer(gl.ARRAY_BUFFER, color_buff);
        try { attr_color = gl.getAttribLocation(gl.program, 'a_color'); } catch (e) { clog('COLOR ERR\n' + e); }
        gl.vertexAttribPointer(attr_color, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attr_color);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buff);

    } else {
        let vert_buff = make_buff(gl, gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
        if (!vert_buff) clog('Failed to create the buffer object');
        gl.bindBuffer(gl.ARRAY_BUFFER, vert_buff);

        try { attr_pos = gl.getAttribLocation(gl.program, 'a_pos'); } catch (e) { clog('POS ERR\n' + e);}
        gl.vertexAttribPointer(attr_pos, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attr_pos);
    }

    return n;
}
function make_buff(gl, target, bufferArray, usage) {
    let buffer = gl.createBuffer();
    gl.bindBuffer(target, buffer);
    gl.bufferData(target, bufferArray, usage);
    return buffer;
}