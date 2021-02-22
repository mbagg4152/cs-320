const SRC_VERT = 'attribute vec4 a_pos; uniform mat4 u_matrix; void main() { gl_Position = u_matrix*a_pos; }';
const FRAG_BASIC = 'precision mediump float; uniform vec4 u_col;  void main() { gl_FragColor = u_col; }';
const ANIM_TXT1 = 'Start animation', ANIM_TXT2 = 'Stop animation';
const POINTS = [-0.2, -0.2, -0.2, 0.2, 0.2, 0.2, -0.2, -0.2, 0.2, 0.2, 0.2, -0.2];
const COLOR = vec4('#00447d'), REG_ANGLE = 45.0, SCALE = 2.0, ANIM_ANGLE = 1.0;

let canvas = elem('wgl_canvas');
let wgl_ctx, m_matrix, a_position, u_color, u_matrix, req_id;
let b_move = elem('b_move'), b_scale = elem('b_scale'), b_rotate = elem('b_rotate'), b_anim = elem('b_animate');
let b_center = elem('b_center'), b_resize = elem('b_resize'), b_zero = elem('b_zero');
let move_x = 10/canvas.clientWidth, move_y = 10/canvas.clientHeight;
let count_move = 0.0, count_scale = 0.0, count_rot = 0.0, v_count, anim_timer = 0;

function main() {
    setup_webgl(); // init webgl components
    setup_buttons(); // disable undo operation buttons & set animation button text
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

function setup_buttons() {
    b_center.disabled = true;
    b_resize.disabled = true;
    b_zero.disabled = true;
    b_anim.innerText = ANIM_TXT1;
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

b_move.onclick = function move() { // move quad
    count_move += 1.0;
    b_center.disabled = false;
    m_matrix.translate(move_x, move_y, 0);
    update_canvas(wgl_ctx, a_position, POINTS, u_matrix, m_matrix);
}

b_center.onclick = function center() { // move quad back to center
    count_move = 0.0;
    b_center.disabled = true;
    update_matrix(false);
    update_canvas(wgl_ctx, a_position, POINTS, u_matrix, m_matrix);
}

b_scale.onclick = function scale() { // scale quad by 2
    count_scale += 1.0;
    b_resize.disabled = false;
    m_matrix.scale(SCALE, SCALE, 0);
    update_canvas(wgl_ctx, a_position, POINTS, u_matrix, m_matrix);
}

b_resize.onclick = function unscale() { // set quad to original size
    count_scale = 0.0;
    b_resize.disabled = true;
    update_matrix(false);
    update_canvas(wgl_ctx, a_position, POINTS, u_matrix, m_matrix);
}

b_rotate.onclick = function rotate() { // rotate quad 45 degrees
    count_rot += 1.0;
    b_zero.disabled = false;
    update_matrix(false);
    update_canvas(wgl_ctx, a_position, POINTS, u_matrix, m_matrix);
}

b_zero.onclick = function zero() { // set quad rotation back to 0 degrees
    count_rot = 0.0;
    b_zero.disabled = true;
    update_matrix(false);
    update_canvas(wgl_ctx, a_position, POINTS, u_matrix, m_matrix);
}

b_anim.onclick = function animate() {
    if (b_anim.innerText === ANIM_TXT1) {
        b_anim.innerText = ANIM_TXT2; // update to say 'stop animation'
        // disable other buttons so they cant be used while animating
        b_move.disabled = true;
        b_scale.disabled = true;
        b_rotate.disabled = true;
        b_center.disabled = true;
        b_resize.disabled = true;
        b_zero.disabled = true;
        rotate_animation(); // start animation
    } else if (b_anim.innerText === ANIM_TXT2) {
        cancelAnimationFrame(req_id); // stop animation
        // re-enable basic buttons
        b_anim.innerText = ANIM_TXT1;
        b_move.disabled = false;
        b_scale.disabled = false;
        b_rotate.disabled = false;
        // reset counters for rotation, movement and scaling
        count_rot = 0.0;
        count_scale = 0.0;
        count_move = 0.0;
        anim_timer = 0;
        update_matrix(false);
        update_canvas(wgl_ctx, a_position, POINTS, u_matrix, m_matrix); // will reset square to start
    }
}

function rotate_animation() {
    req_id = window.requestAnimationFrame(rotate_animation); // get id of request, used for stopping animation
    render_rotation(); // update values for animation
}

function render_rotation() {
    anim_timer++;
    count_rot += 1.0;
    update_matrix(true);
    update_canvas(wgl_ctx, a_position, POINTS, u_matrix, m_matrix);
}