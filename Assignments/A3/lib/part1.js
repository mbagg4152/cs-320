const src_vert = code_lines(['attribute vec4 a_pos;',
                             'uniform vec4 u_trans;',
                             'void main() {',
                             '  gl_Position = a_pos + u_trans;',
                             '  gl_PointSize = 10.0;',
                             '}']);
const src_vert_circ = 'attribute float vertexId;\n' +
    'uniform float numVerts;\n' +
    'uniform vec2 resolution;\n' +
    '\n' +
    '#define PI radians(180.0)\n' +
    '\n' +
    'void main() {\n' +
    '  float numSlices = 8.0;\n' +
    '  float sliceId = floor(vertexId / 3.0);\n' +
    '  float triVertexId = mod(vertexId, 3.0);\n' +
    '  float edge = triVertexId + sliceId;\n' +
    '  float angleU = edge / numSlices;  // 0.0 to 1.0\n' +
    '  float angle = angleU * PI * 2.0;\n' +
    '  float radius = step(triVertexId, 1.5);\n' +
    '  vec2 pos = vec2(cos(angle), sin(angle)) * radius;\n' +
    '\n' +
    '  float aspect = resolution.y / resolution.x;\n' +
    '  vec2 scale = vec2(aspect, 1);\n' +
    '  \n' +
    '  gl_Position = vec4(pos * scale, 0, 1);\n' +
    '}';
const src_frag = code_lines(['void main() {',
                             '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);',
                             '}']);

// The translation distance for x, y, and z direction
let dx = 0.0, dy = 0.0, dz = 0.0;
let can4, gl4, n, u_trans, a_pos,
    can1, can2, can3, gl1, gl2, gl3;
can4 = elem('canvas4');
can2 = elem('canvas2');
can3 = elem('canvas3');
const tri_points = [0, 0.5, -0.5, -0.5, 0.5, -0.5], sq_points = [0, 0,
                                                                 0, 0.1,
                                                                 0.1, 0.1,
                                                                 0, 0,
                                                                 0.1, 0.1,
                                                                 0.1, 0],
    dot_points = [0, 0];
let r_verts, r_num_verts, r_res;
function main() {
    config_draw(gl2, 'T', can2);
    config_draw(gl4, 'S', can4);
}

function config_draw(gl, shape, canvas) {
    try { gl = getWebGLContext(canvas); } catch (e) { alert(e); }
    try { initShaders(gl, src_vert, src_frag); } catch (e) { alert(e); }
    try { n = initVertexBuffers(gl, shape); } catch (e) { alert(e); }
    try { u_trans = gl.getUniformLocation(gl.program, 'u_trans'); } catch (e) { alert(e); }
    gl.uniform4f(u_trans, dx, dy, dz, 0.0);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (shape === 'S') gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    else if (shape === 'T') gl.drawArrays(gl.TRIANGLES, 0, n);

}

function initVertexBuffers(gl, shape) {
    let n = -1, verts;

    if (shape === 'T') {
        n = 3;
        verts = new Float32Array(tri_points);

    } else if (shape === 'S') {
        n = 6;
        verts = new Float32Array(sq_points);
    } else if (shape === 'O') {

    } else if (shape === 'C') {

    }
    let vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) alert('Failed to create the buffer object');
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    a_pos = gl.getAttribLocation(gl.program, 'a_pos');
    if (a_pos < 0) alert('Failed to get the storage location of a_pos');
    gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_pos);

    return n;
}