let can1 = elem('canvas1'), can2 = elem('canvas2'), can3 = elem('canvas3'), can4 = elem('canvas4'), shift_x = 0.0,
    shift_y = 0.0, shift_z = 0.0;
let attr_pos, gl1, gl2, gl3, gl4, pts_circle, pts_ellipse, uni_color, uni_height, uni_res, uni_trans, uni_width,
    v_count;

function main() {
    pts_circle = make_round_points(CIRC, 0, 0);
    pts_ellipse = make_round_points(ELL, 0.6, 0.4);
    config_draw(gl1, ELL, can1, v4_red, src_vert, src_frag, BASIC);
    config_draw(gl2, TRI, can2, v4_blue, src_vert, grad_frag, GRAD);
    config_draw(gl3, CIRC, can3, v4_green, src_vert, rad_frag, RAD);
    config_draw(gl4, SQRE, can4, v4_black, src_vert, grad_frag, GRAD);
}

function config_draw(gl, shape, canvas, color_vals, v_shader, f_shader, grad_type) {
    try { gl = getWebGLContext(canvas); } catch (e) { alert('CTX ERR\n' + e); }
    if (f_shader === null || f_shader === undefined || !f_shader) clog('frag shader is null/undefined :(');
    try { initShaders(gl, v_shader, f_shader); } catch (e) { clog('SHADER ERR\n' + e); }
    try { v_count = init_buffers(gl, shape); } catch (e) { clog('VBUFF ERR\n' + e); }
    try { uni_trans = gl.getUniformLocation(gl.program, 'u_trans'); } catch (e) { clog('TRANS ERR\n' + e); }

    if (grad_type === BASIC) {
        try { uni_color = gl.getUniformLocation(gl.program, 'l_color'); } catch (e) { clog('COLOR ERR\n' + e); }
        gl.uniform4f(uni_color, color_vals[0], color_vals[1], color_vals[2], color_vals[3]);
    } else if (grad_type === GRAD || grad_type === RAD) {
        try { uni_height = gl.getUniformLocation(gl.program, 'u_height'); } catch (e) { clog('HEIGHT ERR:' + e); }
        try { uni_width = gl.getUniformLocation(gl.program, 'u_width'); } catch (e) { clog('WIDTH ERR:' + e); }
        gl.uniform1f(uni_width, gl.drawingBufferWidth);
        gl.uniform1f(uni_height, gl.drawingBufferHeight);
    }

    gl.uniform4f(uni_trans, shift_x, shift_y, shift_z, 0.0);
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (shape === 'S') gl.drawArrays(gl.TRIANGLE_STRIP, 0, v_count);
    else if (shape === 'T') gl.drawArrays(gl.TRIANGLES, 0, v_count);
    else if (shape === 'C' || shape === 'E') gl.drawArrays(gl.TRIANGLE_STRIP, 0, v_count);
}




