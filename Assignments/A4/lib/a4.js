const SRC_VERT = 'attribute vec4 a_pos; uniform mat4 u_matrix; void main() { gl_Position = u_matrix*a_pos; }';
const FRAG_BASIC = 'precision mediump float; uniform vec4 u_col;  void main() { gl_FragColor = u_col; }';
const ANIM_TXT1 = 'Start animation', ANIM_TXT2 = 'Stop animation';
const POINTS = [-0.2, -0.2, -0.2, 0.2, 0.2, 0.2, -0.2, -0.2, 0.2, 0.2, 0.2, -0.2];
const COLOR = vec4('#00447d'), ANGLE = 45.0, SCALE = 2.0;

let canvas = elem('wgl_canvas');
let wgl_ctx, m_matrix, a_position, u_color, u_matrix;
let b_move = elem('b_move'), b_scale = elem('b_scale'), b_rotate = elem('b_rotate'), b_anim = elem('b_animate');
let b_center = elem('b_center'), b_resize = elem('b_resize'), b_zero = elem('b_zero');
let move_x = 10/canvas.clientWidth, move_y = 10/canvas.clientHeight;
let count_move = 0.0, count_scale = 0.0, count_rot = 0.0, v_count;

function main() {
    setup_webgl();
    setup_buttons();
}

function setup_webgl() {
    m_matrix = new Matrix4();
    wgl_ctx = getWebGLContext(canvas);
    initShaders(wgl_ctx, SRC_VERT, FRAG_BASIC);
    u_matrix = wgl_ctx.getUniformLocation(wgl_ctx.program, 'u_matrix');
    v_count = init_buffers(wgl_ctx, POINTS, a_position);
    u_color = wgl_ctx.getUniformLocation(wgl_ctx.program, 'u_col');
    wgl_ctx.uniform4f(u_color, COLOR[0], COLOR[1], COLOR[2], COLOR[3]);
    wgl_ctx.uniformMatrix4fv(u_matrix, false, m_matrix.elements);
    wgl_ctx.clearColor(1, 1, 1, 1);
    wgl_ctx.clear(wgl_ctx.COLOR_BUFFER_BIT);
    wgl_ctx.drawArrays(wgl_ctx.TRIANGLE_STRIP, 0, v_count);
}

function setup_buttons() {
    b_center.disabled = true;
    b_resize.disabled = true;
    b_zero.disabled = true;
    b_anim.innerText = ANIM_TXT1;
}

function update_matrix() {
    m_matrix = new Matrix4();
    if (count_rot) m_matrix.setRotate(ANGLE*count_rot, 0, 0, 1);
    if (count_scale) m_matrix.scale(SCALE*count_scale, SCALE*count_scale, 0);
    if (count_move) m_matrix.translate(count_move*move_x, count_move*move_y, 0);
}

b_move.onclick = function move() {
    count_move += 1.0;
    b_center.disabled = false;
    m_matrix.translate(move_x, move_y, 0);
    update_canvas(wgl_ctx, a_position, POINTS, u_matrix, m_matrix);
}

b_center.onclick = function center() {
    count_move = 0.0;
    b_center.disabled = true;
    update_matrix();
    update_canvas(wgl_ctx, a_position, POINTS, u_matrix, m_matrix);
}

b_scale.onclick = function scale() {
    count_scale += 1.0;
    b_resize.disabled = false;
    m_matrix.scale(SCALE, SCALE, 0);
    update_canvas(wgl_ctx, a_position, POINTS, u_matrix, m_matrix);
}

b_resize.onclick = function unscale() {
    count_scale = 0.0;
    b_resize.disabled = true;
    update_matrix();
    update_canvas(wgl_ctx, a_position, POINTS, u_matrix, m_matrix);
}

b_rotate.onclick = function rotate() {
    count_rot += 1.0;
    b_zero.disabled = false;
    update_matrix();
    update_canvas(wgl_ctx, a_position, POINTS, u_matrix, m_matrix);
}

b_zero.onclick = function zero() {
    count_rot = 0.0;
    b_zero.disabled = true;
    update_matrix();
    update_canvas(wgl_ctx, a_position, POINTS, u_matrix, m_matrix);
}

b_anim.onclick = function animate() {
    if (b_anim.innerText === ANIM_TXT1) {
        b_anim.innerText = ANIM_TXT2;
        b_move.disabled = true;
        b_scale.disabled = true;
        b_rotate.disabled = true;
    } else if (b_anim.innerText === ANIM_TXT2) {
        b_anim.innerText = ANIM_TXT1;
        b_move.disabled = false;
        b_scale.disabled = false;
        b_rotate.disabled = false;
    }
}