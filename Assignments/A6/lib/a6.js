// Maggie Horton - Graphics Assignment 6 Winter 2021
const // webgl shaders
    SRC_VERT = 'attribute vec4 a_pos;  attribute vec4 a_col;  uniform mat4 u_matrix; varying vec4 v_col;' +
               'void main() {  gl_Position = u_matrix * a_pos; v_col = a_col; }',
    SRC_FRAG = 'precision mediump float; varying vec4 v_col; void main() {  gl_FragColor = v_col; }';

const C1 = vec3('#6300ec'), C2 = vec3('#0082db'), C3 = vec3('#a8005c'), // colors for visible faces
    CX = vec3('#000000'), CC = vec3('#033268'); // color for non-visible faces, webgl clear color

const // vertices for cubes faces
    FACE1 = [1.5, 1.5, 1.5, -1.5, 1.5, 1.5, -1.5, -1.5, 1.5, 1.5, -1.5, 1.5],
    FACE2 = [1.5, 1.5, 1.5, 1.5, -1.5, 1.5, 1.5, -1.5, -1.5, 1.5, 1.5, -1.5],
    FACE3 = [1.5, 1.5, 1.5, 1.5, 1.5, -1.5, -1.5, 1.5, -1.5, -1.5, 1.5, 1.5],
    FACE4 = [-1.5, 1.5, 1.5, -1.5, 1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, 1.5],
    FACE5 = [-1.5, -1.5, -1.5, 1.5, -1.5, -1.5, 1.5, -1.5, 1.5, -1.5, -1.5, 1.5],
    FACE6 = [1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, 1.5, -1.5, 1.5, 1.5, -1.5],
    // indices for cubes faces
    IDX_F1 = [0, 1, 2, 0, 2, 3], IDX_F2 = [4, 5, 6, 4, 6, 7], IDX_F3 = [8, 9, 10, 8, 10, 11],
    IDX_F4 = [12, 13, 14, 12, 14, 15], IDX_F5 = [16, 17, 18, 16, 18, 19], IDX_F6 = [20, 21, 22, 20, 22, 23];

const VERT_ARR = [].concat(FACE1, FACE2, FACE3, FACE4, FACE5, FACE6);
const COLOR_ARR = [].concat(C1, C1, C1, C1, C2, C2, C2, C2, C3, C3, C3, C3, CX, CX, CX, CX, CX, CX, CX, CX, CX, CX, CX, CX);
const IDX_ARR = [].concat(IDX_F1, IDX_F2, IDX_F3, IDX_F4, IDX_F5, IDX_F6);

let wgl_ctx, m_matrix, u_matrix, v_count, a_atrib;
let canvas = elem('wgl_canvas');

function main() {
    setup_webgl(); // setup webgl components and matrix
    wgl_ctx.clear(wgl_ctx.COLOR_BUFFER_BIT | wgl_ctx.DEPTH_BUFFER_BIT); // clear canvas
    wgl_ctx.drawElements(wgl_ctx.TRIANGLES, v_count, wgl_ctx.UNSIGNED_BYTE, 0); // draw cube
}

function setup_webgl() {
    wgl_ctx = getWebGLContext(canvas); // get webgl context
    initShaders(wgl_ctx, SRC_VERT, SRC_FRAG); // attach shaders
    v_count = init_buffs(wgl_ctx); // setup program buffers
    wgl_ctx.clearColor(CC[0], CC[1], CC[2], 1.0); // set canvas clear color
    wgl_ctx.enable(wgl_ctx.DEPTH_TEST);

    m_matrix = new Matrix4(); // make new matrix
    m_matrix.setPerspective(40, 1, 1, 100); // set cube perspective
    m_matrix.lookAt(5, 6, 7, 0, 0, 0, 1, 1, 2); // set look at
    u_matrix = wgl_ctx.getUniformLocation(wgl_ctx.program, 'u_matrix'); // get webgl uniform matrix
    wgl_ctx.uniformMatrix4fv(u_matrix, false, m_matrix.elements); // set webgl matrix's perspective & look at vals
}

function init_buffs(gl) { // set up vertex buffer for webgl
    let idx_buff = gl.createBuffer(), uint_idx = new Uint8Array(IDX_ARR); // make new buff
    init_float_buff(gl, 'a_pos', new Float32Array(VERT_ARR)); // get a_pos from shader and set values
    init_float_buff(gl, 'a_col', new Float32Array(COLOR_ARR)); // get a_col from shader and set values
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idx_buff); // bind index buff to program
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, uint_idx, gl.STATIC_DRAW); // populate index buff with values
    return uint_idx.length; // return size to be used in drawing cube
}






















