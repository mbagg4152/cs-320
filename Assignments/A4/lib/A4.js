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

function init_buffers(gl, verts) {
    let vert_buff;
    try {
        vert_buff = gl.createBuffer();
    } catch (e) {
        clog('failed making vbuff');
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vert_buff);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    try { attr_pos = gl.getAttribLocation(gl.program, 'a_pos'); } catch (e) { clog('POS ERR\n' + e);}
    gl.vertexAttribPointer(attr_pos, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attr_pos);
    return verts.length/2;
}

function vec4(color_hex) { // hex --> decimal --> vec4: #RRGGBB --> R,G,B --> (R/255),(G/255),(B/255)
    let color_copy = color_hex;
    color_copy = color_copy.replace('#', '');
    return [hex_vec4(color_copy, 0, 1), hex_vec4(color_copy, 2, 3), hex_vec4(color_copy, 4, 5), 1.0];
}

function hex_vec4(line, idx0, idx1) { // get hex for R, G or B based on index values then divide by 255
    return (parseInt([line.charAt(idx0), line.charAt(idx1)].join(''), 16)/255.0).toFixed(5);
}

function clog(text) { console.log(text); } // rename console.log

function elem(id) { return document.getElementById(id); } // rename document.getElementById