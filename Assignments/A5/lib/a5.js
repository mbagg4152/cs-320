// Maggie Horton - Graphics Assignment 4 Winter 2021
const SRC_VERT = 'attribute vec4 a_pos;  ' +
                 'attribute vec4 a_col; ' +
                 'uniform mat4 u_vm;' +
                 'uniform mat4 u_pm;' +
                 'varying vec4 v_col;' +
                 'void main() { ' +
                 'gl_Position = u_pm * u_vm * a_pos;  ' +
                 'v_col = a_col; }';
const FRAG_BASIC = 'precision mediump float;' +
                   'varying vec4 v_col;' +
                   'void main() { ' +
                   'gl_FragColor = v_col; ' +
                   '}';
const POINTS = [-0.2, -0.2,
                -0.2, 0.2,
                0.2, 0.2,
                -0.2, -0.2,
                0.2, 0.2,
                0.2, -0.2];
const COLOR = vec4('#00447d');

let canvas = elem('wgl_canvas');
let wgl_ctx, v_matrix, p_matrix, a_position, a_color, u_view, u_proj;
let numVertex = 3, numColor = 3, n = 18, v_count = 0;
let pc = new Float32Array([
                              // Three triangles on the right side
                              0.75, 1.0, -4.0, 0.4, 1.0, 0.4, // The back green one
                              0.25, -1.0, -4.0, 0.4, 1.0, 0.4,
                              1.25, -1.0, -4.0, 1.0, 0.4, 0.4,

                              0.75, 1.0, -2.0, 1.0, 1.0, 0.4, // The middle yellow one
                              0.25, -1.0, -2.0, 1.0, 1.0, 0.4,
                              1.25, -1.0, -2.0, 1.0, 0.4, 0.4,

                              0.75, 1.0, 0.0, 0.4, 0.4, 1.0,  // The front blue one
                              0.25, -1.0, 0.0, 0.4, 0.4, 1.0,
                              1.25, -1.0, 0.0, 1.0, 0.4, 0.4,

                              // Three triangles on the left side
                              -0.75, 1.0, -4.0, 0.4, 1.0, 0.4, // The back green one
                              -1.25, -1.0, -4.0, 0.4, 1.0, 0.4,
                              -0.25, -1.0, -4.0, 1.0, 0.4, 0.4,

                              -0.75, 1.0, -2.0, 1.0, 1.0, 0.4, // The middle yellow one
                              -1.25, -1.0, -2.0, 1.0, 1.0, 0.4,
                              -0.25, -1.0, -2.0, 1.0, 0.4, 0.4,

                              -0.75, 1.0, 0.0, 0.4, 0.4, 1.0,  // The front blue one
                              -1.25, -1.0, 0.0, 0.4, 0.4, 1.0,
                              -0.25, -1.0, 0.0, 1.0, 0.4, 0.4,
                          ]);

let tri1 = new Float32Array([0.0, 0.5, -0.1, 0.0, 0.0, 1.0,
                             -0.5, -0.5, -0.1, 0.0, 0.0, 1.0,
                             0.5, -0.5, -0.1, 1.0, 1.0, 0.0,]);
let tri2 = new Float32Array([0.5, 0.4, -0.5, 1.0, 1.0, 0.0,
                             -0.5, 0.4, -0.5, 1.0, 0.0, 0.0,
                             0.0, -0.6, -0.5, 1.0, 0.0, 0.0,]);

function main() {
    setup_webgl();

}

function setup_webgl() {
    v_matrix = new Matrix4();
    p_matrix = new Matrix4();
    wgl_ctx = getWebGLContext(canvas);
    initShaders(wgl_ctx, SRC_VERT, FRAG_BASIC);
    v_count = init_vbuff(wgl_ctx, a_position, a_color, numVertex, numColor, pc); // setup buffer
    u_view = wgl_ctx.getUniformLocation(wgl_ctx.program, 'u_vm');
    u_proj = wgl_ctx.getUniformLocation(wgl_ctx.program, 'u_pm');

    v_matrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
    p_matrix.setPerspective(30, canvas.width/canvas.height, 1, 100);

    wgl_ctx.uniformMatrix4fv(u_view, false, v_matrix.elements);
    wgl_ctx.uniformMatrix4fv(u_proj, false, p_matrix.elements);
    wgl_ctx.enable(wgl_ctx.DEPTH_TEST);
    wgl_ctx.clearColor(0.0, 0.0, 0.0, 1.0);
    wgl_ctx.clear(wgl_ctx.COLOR_BUFFER_BIT);
    wgl_ctx.drawArrays(wgl_ctx.TRIANGLES, 0, n);
}

function init_vbuff(gl, a_pos, a_col, vert_num, col_num, points) { // set up vertex buffer for webgl

    let pc_buff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pc_buff);
    gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);

    let B_SIZE = points.BYTES_PER_ELEMENT;

    a_pos = gl.getAttribLocation(gl.program, 'a_pos');
    gl.vertexAttribPointer(a_pos, 3, gl.FLOAT, false, B_SIZE*6, 0);
    gl.enableVertexAttribArray(a_pos);

    a_col = gl.getAttribLocation(gl.program, 'a_col');
    gl.vertexAttribPointer(a_col, col_num, gl.FLOAT, false, B_SIZE*6, B_SIZE*3);
    gl.enableVertexAttribArray(a_col);

    return n;
}
