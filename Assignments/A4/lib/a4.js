const SRC_VERT = 'attribute vec4 a_pos; uniform vec4 u_trans; void main() { gl_Position = a_pos + u_trans; }';
const FRAG_BASIC = 'precision mediump float; uniform vec4 u_col;  void main() { gl_FragColor = u_col; }';
const tbtn_txt1 = 'Translate by 10', tbtn_txt2 = 'Move back', sbtn_txt1 = 'Scale by 2', sbtn_txt2 = 'Original size',
    rbtn_txt1 = 'Rotate 45 degrees', rbtn_txt2 = 'Rotate back', abtn_txt1 = 'Start animation',
    abtn_txt2 = 'Stop animation';

const pts = [-0.2, -0.2, -0.2, 0.2, 0.2, 0.2, -0.2, -0.2, 0.2, 0.2, 0.2, -0.2];
const color = vec4('#8d0000');

let canvas = elem('wgl_canvas');
let shift_x = 0.0;
let shift_y = 0.0;
let shift_z = 0.0;
let attr_pos;
let wgl_ctx;
let uni_color;
let uni_trans;
let v_count;
let btn_translate = elem('btn_translate');
let btn_scale = elem('btn_scale');
let btn_rotate = elem('btn_rotate');
let btn_animate = elem('btn_animate');

function main() {
    setup_webgl();
    btn_translate.onclick = function () {trans_click();}
    btn_scale.onclick = function () {scale_click();}
    btn_rotate.onclick = function () {rotate_click();}
    btn_animate.onclick = function () {animate_click();}

}

function setup_webgl() {
    try { wgl_ctx = getWebGLContext(canvas); } catch (e) { alert('CTX ERR\n' + e); }
    try { initShaders(wgl_ctx, SRC_VERT, FRAG_BASIC); } catch (e) { clog('SHADER ERR\n' + e); }
    try { uni_trans = wgl_ctx.getUniformLocation(wgl_ctx.program, 'u_trans'); } catch (e) { clog('TRANS ERR\n' + e); }
    try { v_count = init_buffers(wgl_ctx, pts); } catch (e) { clog('BUFF ERR\n' + e); }
    try { uni_color = wgl_ctx.getUniformLocation(wgl_ctx.program, 'u_col'); } catch (e) { clog('COLOR ERR\n' + e); }
    wgl_ctx.uniform4f(uni_color, color[0], color[1], color[2], color[3]);
    wgl_ctx.uniform4f(uni_trans, shift_x, shift_y, shift_z, 0.0);
    wgl_ctx.clearColor(1, 1, 1, 1);
    wgl_ctx.clear(wgl_ctx.COLOR_BUFFER_BIT);
    wgl_ctx.drawArrays(wgl_ctx.TRIANGLE_STRIP, 0, v_count);
}

function trans_click() {
    if (btn_translate.innerText === tbtn_txt1) btn_translate.innerText = tbtn_txt2;
    else if (btn_translate.innerText === tbtn_txt2) btn_translate.innerText = tbtn_txt1;

}

function scale_click() {
    if (btn_scale.innerText === sbtn_txt1) btn_scale.innerText = sbtn_txt2;
    else if (btn_scale.innerText === sbtn_txt2) btn_scale.innerText = sbtn_txt1;
}

function rotate_click() {
    if (btn_rotate.innerText === rbtn_txt1) btn_rotate.innerText = rbtn_txt2;
    else if (btn_rotate.innerText === rbtn_txt2) btn_rotate.innerText = rbtn_txt1;
}

function animate_click() {
    if (btn_animate.innerText === abtn_txt1) {
        btn_animate.innerText = abtn_txt2;
        btn_translate.disabled = true;
        btn_scale.disabled = true;
        btn_rotate.disabled = true;
    } else if (btn_animate.innerText === abtn_txt2) {
        btn_animate.innerText = abtn_txt1;
        btn_translate.disabled = false;
        btn_scale.disabled = false;
        btn_rotate.disabled = false;
    }
}