// Maggie Horton - Graphics Assignment 4 Winter 2021
const SRC_VERT = 'attribute vec4 a_pos; uniform mat4 u_matrix; void main() { gl_Position = u_matrix*a_pos; }';
const FRAG_BASIC = 'precision mediump float; uniform vec4 u_col;  void main() { gl_FragColor = u_col; }';
const ANIM_TXT1 = 'Start animation', ANIM_TXT2 = 'Stop animation';
const POINTS = [-0.2, -0.2, -0.2, 0.2, 0.2, 0.2, -0.2, -0.2, 0.2, 0.2, 0.2, -0.2];
const COLOR = vec4('#00447d'), REG_ANGLE = 45.0, SCALE = 2.0, ANIM_ANGLE = 1.0;

let canvas = elem('wgl_canvas');
let wgl_ctx, m_matrix, a_position, u_color, u_matrix, req_id;
let move_x = 10/canvas.clientWidth, move_y = 10/canvas.clientHeight;
let count_move = 0.0, count_scale = 0.0, count_rot = 0.0, v_count, anim_timer = 0;

function main() {
    setup_webgl(); // init webgl components

}

function setup_webgl() {
    m_matrix = new Matrix4(); // make matrix for transformation
    wgl_ctx = getWebGLContext(canvas);
    initShaders(wgl_ctx, SRC_VERT, FRAG_BASIC);
    u_matrix = wgl_ctx.getUniformLocation(wgl_ctx.program, 'u_matrix'); // get matrix variable
    v_count = init_vbuff(wgl_ctx, POINTS, a_position); // setup buffer
    u_color = wgl_ctx.getUniformLocation(wgl_ctx.program, 'u_col'); // get color variable
    wgl_ctx.uniform4f(u_color, COLOR[0], COLOR[1], COLOR[2], COLOR[3]); // set color
    wgl_ctx.uniformMatrix4fv(u_matrix, false, m_matrix.elements); // set value for transformation matrix
    wgl_ctx.clearColor(1, 1, 1, 1);
    wgl_ctx.clear(wgl_ctx.COLOR_BUFFER_BIT);
    wgl_ctx.drawArrays(wgl_ctx.TRIANGLE_STRIP, 0, v_count);
}



function update_matrix(anim) { // update transformation matrix
    m_matrix = new Matrix4();
    if (anim) { // different angle of rotation used for animation
        if (count_rot) m_matrix.setRotate(ANIM_ANGLE*count_rot, 0, 0, 1);
    } else {
        // when changes are made to matrix, if it is already moved, rotated or scaled, code will set new matrix with these old vals
        if (count_rot) m_matrix.setRotate(REG_ANGLE*count_rot, 0, 0, 1);
        if (count_scale) m_matrix.scale(SCALE*count_scale, SCALE*count_scale, 0);
        if (count_move) m_matrix.translate(count_move*move_x, count_move*move_y, 0);
    }
}

