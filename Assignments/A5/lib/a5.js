// Maggie Horton - Graphics Assignment 4 Winter 2021
const SRC_VERT = 'attribute vec4 a_pos;  attribute vec4 a_col;  varying vec4 v_col;' +
    'void main() { gl_Position = a_pos;  v_col = a_col; }';
const FRAG_BASIC = 'precision mediump float;' +
    'varying vec4 v_col; void main() { gl_FragColor = v_col; }';
const ANIM_TXT1 = 'Start animation', ANIM_TXT2 = 'Stop animation';
const POINTS = [-0.2, -0.2, -0.2, 0.2, 0.2, 0.2, -0.2, -0.2, 0.2, 0.2, 0.2, -0.2];
const COLOR = vec4('#00447d'), REG_ANGLE = 45.0, SCALE = 2.0, ANIM_ANGLE = 1.0;

let canvas = elem('wgl_canvas');
let wgl_ctx, m_matrix, a_position, u_color, u_matrix, req_id;
let move_x = 10 / canvas.clientWidth, move_y = 10 / canvas.clientHeight;
let count_move = 0.0, count_scale = 0.0, count_rot = 0.0, v_count, anim_timer = 0;

function main() {
    //setup_webgl(); // init webgl components
    // var canvas = document.getElementById('webgl'); // Retrieve <canvas> element
    var gl = getWebGLContext(canvas);              // Get the rendering context for WebGL
    initShaders(gl, SRC_VERT, FRAG_BASIC);   // Initialize shaders
    var n = init_vbuff(gl);      // Set vertex coordinates and colors

    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Specify the color for clearing <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);      // Clear <canvas>
    gl.drawArrays(gl.TRIANGLES, 0, n);  // Draw the triangles

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
        if (count_rot) m_matrix.setRotate(ANIM_ANGLE * count_rot, 0, 0, 1);
    } else {
        // when changes are made to matrix, if it is already moved, rotated or scaled, code will set new matrix with these old vals
        if (count_rot) m_matrix.setRotate(REG_ANGLE * count_rot, 0, 0, 1);
        if (count_scale) m_matrix.scale(SCALE * count_scale, SCALE * count_scale, 0);
        if (count_move) m_matrix.translate(count_move * move_x, count_move * move_y, 0);
    }
}

function init_vbuff(gl) { // set up vertex buffer for webgl
    // let vert_buff;
    // try {
    //     vert_buff = gl.createBuffer();
    // } catch (e) {
    //     clog('failed making vbuff');
    //     return -1;
    // }
    // gl.bindBuffer(gl.ARRAY_BUFFER, vert_buff);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    // try { attr_pos = gl.getAttribLocation(gl.program, 'a_pos'); } catch (e) { clog('POS ERR\n' + e);}
    // gl.vertexAttribPointer(attr_pos, 2, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(attr_pos);
    // return verts.length/2;
    var pc = new Float32Array([ // Vertex coordinates and color
        0.0, 0.5, -0.1, 0.0, 0.0, 1.0,  // The front blue one
        -0.5, -0.5, -0.1, 0.0, 0.0, 1.0,
        0.5, -0.5, -0.1, 1.0, 1.0, 0.0,

        0.5, 0.4, -0.5, 1.0, 1.0, 0.0,  // The red triangle is behind
        -0.5, 0.4, -0.5, 1.0, 0.0, 0.0,
        0.0, -0.6, -0.5, 1.0, 0.0, 0.0,
    ]);
    var numVertex = 3;
    var numColor = 3;
    var n = 6;

    // Create a buffer object and write data to it
    var pcbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pcbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, pc, gl.STATIC_DRAW);

    var FSIZE = pc.BYTES_PER_ELEMENT;   // The number of byte
    var STRIDE = numVertex + numColor;　// Stride

    // Assign the vertex coordinates to attribute variable and enable the assignment
    var a_Position = gl.getAttribLocation(gl.program, 'a_pos');
    gl.vertexAttribPointer(a_Position, numVertex, gl.FLOAT, false, FSIZE * STRIDE, 0);
    gl.enableVertexAttribArray(a_Position);

    // Assign the vertex colors to attribute variable and enable the assignment
    var a_Color = gl.getAttribLocation(gl.program, 'a_col');
    gl.vertexAttribPointer(a_Color, numColor, gl.FLOAT, false, FSIZE * STRIDE, FSIZE * numVertex);
    gl.enableVertexAttribArray(a_Color);

    return n;
}
