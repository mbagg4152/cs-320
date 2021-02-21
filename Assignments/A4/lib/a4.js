const SRC_VERT = 'attribute vec4 a_pos; uniform vec4 u_trans; void main() { gl_Position = a_pos + u_trans; }';
const FRAG_BASIC = 'precision mediump float; uniform vec4 u_col;  void main() { gl_FragColor = u_col; }';
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

function main() {
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

