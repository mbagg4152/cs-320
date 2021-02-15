// Maggie Horton Winter 2021

const vShaderCode = code_lines([
    'attribute vec4 v_points;',
    'uniform vec4 v_trans;',
    'void main(){',
    '   gl_Position = v_points + v_trans;',
    ' }']);
const fShaderCode = code_lines([
    // 'precision mediump float;',
    // 'uniform vec4 fragColor;',
    'void main() {',
    '   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);',
    '}']);

let trans_x = 0.5, trans_y = 0.5, trans_z = 0.0;
let canvas, gl;

function main() {
    // alert('main');
    canvas = elem('main_canvas');
    try {gl = getWebGLContext(canvas);} catch (e) {alert('ERR LOADING WEBGL CONTEXT\n' + e);}
    try {initShaders(gl, vShaderCode, fShaderCode);} catch (e) {alert('ERR INIT SHADERS\n' + e);}
    // Write the positions of vertices to a vertex shader
    var n = initVertexBuffers(gl);
    if (n < 0) {
        alert('Failed to set the positions of the vertices');
        return;
    }

    // Pass the translation distance to the vertex shader
    let v_trans = gl.getUniformLocation(gl.program, 'v_trans');
    if (!v_trans) {
        alert('Failed to get the storage location of v_trans');
        return;
    }
    gl.uniform4f(v_trans, trans_x, trans_y, trans_z, 0.0);

    // Specify the color for clearing <canvas>
    gl.clearColor(0, 0, 0, 1);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the rectangle
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
    let vertices = new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    let n = 3; // The number of vertices

    // Create a buffer object
    let vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Assign the buffer object to the attribute variable
    let v_points = gl.getAttribLocation(gl.program, 'v_points');
    if (v_points < 0) {
        alert('NO POINTS\n');
        return -1;
    }
    gl.vertexAttribPointer(v_points, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(v_points);

    return n;
}