// Maggie Horton - Graphics Assignment 4 Winter 2021
const SRC_VERT = 'attribute vec4 a_pos;  attribute vec4 a_col; uniform mat4 u_matrix; varying vec4 v_col;' +
    'void main() { gl_Position =u_matrix* a_pos;  v_col = a_col; }';
const FRAG_BASIC = 'precision mediump float;' +
    'varying vec4 v_col; void main() { gl_FragColor = v_col; }';
const POINTS = [-0.2, -0.2, -0.2, 0.2, 0.2, 0.2, -0.2, -0.2, 0.2, 0.2, 0.2, -0.2];
const COLOR = vec4('#00447d');

let canvas = elem('wgl_canvas');
let wgl_ctx, m_matrix, a_position, a_color, u_matrix;
let numVertex = 3, numColor = 3, n = 6, v_count = 0;
let pc = new Float32Array([ // Vertex coordinates and color
    0.0, 0.5, -0.1, 0.0, 0.0, 1.0,
    -0.5, -0.5, -0.1, 0.0, 0.0, 1.0,
    0.5, -0.5, -0.1, 1.0, 1.0, 0.0,

    0.5, 0.4, -0.5, 1.0, 1.0, 0.0,
    -0.5, 0.4, -0.5, 1.0, 0.0, 0.0,
    0.0, -0.6, -0.5, 1.0, 0.0, 0.0,
]);

function main() {
    setup_webgl();
    wgl_ctx.enable(wgl_ctx.DEPTH_TEST);
    wgl_ctx.clearColor(0.0, 0.0, 0.0, 1.0);
    wgl_ctx.clear(wgl_ctx.COLOR_BUFFER_BIT);
    wgl_ctx.drawArrays(wgl_ctx.TRIANGLES, 0, n);

}

function setup_webgl() {
    m_matrix = new Matrix4(); // make matrix for transformation
    wgl_ctx = getWebGLContext(canvas);
    initShaders(wgl_ctx, SRC_VERT, FRAG_BASIC);
    v_count = init_vbuff(wgl_ctx); // setup buffer
    u_matrix = wgl_ctx.getUniformLocation(wgl_ctx.program, 'u_matrix');
    m_matrix = new Matrix4();
    m_matrix.setOrtho(-1, 1, -1, 1, 0, 1);
    wgl_ctx.uniformMatrix4fv(u_matrix, false, m_matrix.elements);
}


function init_vbuff(gl) { // set up vertex buffer for webgl


    let pc_buff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pc_buff);
    gl.bufferData(gl.ARRAY_BUFFER, pc, gl.STATIC_DRAW);

    let B_SIZE = pc.BYTES_PER_ELEMENT, STRIDE = numVertex + numColor;　// Stride

    a_position = gl.getAttribLocation(gl.program, 'a_pos');
    gl.vertexAttribPointer(a_position, numVertex, gl.FLOAT, false, B_SIZE * STRIDE, 0);
    gl.enableVertexAttribArray(a_position);

    a_color = gl.getAttribLocation(gl.program, 'a_col');
    gl.vertexAttribPointer(a_color, numColor, gl.FLOAT, false, B_SIZE * STRIDE, B_SIZE * numVertex);
    gl.enableVertexAttribArray(a_color);

    return n;
}
