// Maggie Horton - Graphics Final Winter 2021
const SRC_VERT = 'attribute vec4 a_pos; uniform mat4 u_matrix; void main() { gl_Position = u_matrix*a_pos; }';
const FRAG_BASIC = 'precision mediump float; uniform vec4 u_col;  void main() { gl_FragColor = u_col; }';
const POINTS = [0.3, 0.6, 0.0, 0.0, 0.6, 0.0, -0.3, 0.0, -0.6, -0.6, 0.0, -0.6];
const color = vec4('#5f024b'), ANIM_ANGLE = 1.0;
let canvas = elem('wgl_canvas'), b_start = elem('b_animate'), b_stop = elem('b_animate2');
let a_pos, anim_timer = 0, count_rot = 0.0, gl1, m_mat1, req_id, u_col, u_mat, v_count;

function main() {
    m_mat1 = new Matrix4();
    gl1 = getWebGLContext(canvas);
    initShaders(gl1, SRC_VERT, FRAG_BASIC);
    u_mat = gl1.getUniformLocation(gl1.program, 'u_matrix');
    v_count = init_vbuff(gl1, POINTS, a_pos);
    u_col = gl1.getUniformLocation(gl1.program, 'u_col');
    gl1.uniform4f(u_col, color[0], color[1], color[2], color[3]);
    gl1.uniformMatrix4fv(u_mat, false, m_mat1.elements);
    gl1.clearColor(1, 1, 1, 1);
    gl1.clear(gl1.COLOR_BUFFER_BIT);
    gl1.drawArrays(gl1.TRIANGLES, 0, v_count);
    b_stop.disabled = true;

}

function update_matrix(anim, mat, rot_cnt) {
    mat = new Matrix4();
    if (anim) mat.setRotate(ANIM_ANGLE * rot_cnt, 0, 0, 1);
    return mat;
}

b_start.onclick = function () {
    if (b_stop.disabled) {
        b_stop.disabled = false;
        b_start.disabled = true;
        rotate_animation();
    }
}

b_stop.onclick = function () {
    cancelAnimationFrame(req_id);
    m_mat1 = update_matrix(false, m_mat1, count_rot);
    update_canvas(gl1, a_pos, POINTS, u_mat, m_mat1);
    b_stop.disabled = true;
    b_start.disabled = false;
}

function rotate_animation() {
    req_id = window.requestAnimationFrame(rotate_animation);
    render_rotation();
}


function render_rotation() {
    anim_timer++;
    count_rot -= 1.0;
    m_mat1 = update_matrix(true, m_mat1, count_rot);
    update_canvas(gl1, a_pos, POINTS, u_mat, m_mat1);
}

function init_vbuff(gl, verts, attr_pos) {
    let vert_buff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vert_buff);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    attr_pos = gl.getAttribLocation(gl.program, 'a_pos');
    gl.vertexAttribPointer(attr_pos, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attr_pos);
    return verts.length / 2;
}

function update_canvas(gl, pos_loc, points, u_matrix, m_matrix) {
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    let res = init_vbuff(gl, points, pos_loc);
    gl1.uniformMatrix4fv(u_matrix, false, m_matrix.elements);
    gl.drawArrays(gl.TRIANGLES, 0, res);
}

function vec4(color_hex) {
    let color_copy = color_hex;
    color_copy = color_copy.replace('#', '');
    return [hex_vec4(color_copy, 0, 1), hex_vec4(color_copy, 2, 3), hex_vec4(color_copy, 4, 5), 1.0];
}

function hex_vec4(line, idx0, idx1) {
    return (parseInt([line.charAt(idx0), line.charAt(idx1)].join(''), 16) / 255.0).toFixed(5);
}

function clog(text) {
    console.log(text);
}

function elem(id) {
    return document.getElementById(id);
}