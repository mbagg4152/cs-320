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

let can1 = elem('canvas1'), can2 = elem('canvas2'), can3 = elem('canvas3'), can4 = elem('canvas4'), shift_x = 0.0,
    shift_y = 0.0, shift_z = 0.0;
let attr_pos, gl1, gl2, gl3, gl4, pts_circle, pts_ellipse, uni_trans, v_count;

const pts_triangle = [0, 0.5, -0.5, -0.5, 0.5, -0.5],
    pts_square = [-0.3, -0.3, -0.3, 0.3, 0.3, 0.3, -0.3, -0.3, 0.3, 0.3, 0.3, -0.3];

function main() {
    config_draw(gl2, 'T', can2);
    config_draw(gl4, 'S', can4);
    pts_circle = make_circ_points('C', 0, 0);
    pts_ellipse = make_circ_points('E', 0.6, 0.4);
    config_draw(gl3, 'C', can3);
    config_draw(gl1, 'E', can1);
}

function config_draw(gl, shape, canvas) {
    try { gl = getWebGLContext(canvas); } catch (e) { alert(e); }
    try { initShaders(gl, src_vert, src_frag); } catch (e) { alert(e); }
    try { v_count = initVertexBuffers(gl, shape); } catch (e) { alert(e); }
    try { uni_trans = gl.getUniformLocation(gl.program, 'u_trans'); } catch (e) { alert(e); }
    gl.uniform4f(uni_trans, shift_x, shift_y, shift_z, 0.0);
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (shape === 'S') gl.drawArrays(gl.TRIANGLE_STRIP, 0, v_count);
    else if (shape === 'T') gl.drawArrays(gl.TRIANGLES, 0, v_count);
    else if (shape === 'C' || shape === 'E') gl.drawArrays(gl.TRIANGLE_STRIP, 0, v_count);
}

function make_circ_points(shape, a, b) {
    let verts = [];
    for (let i = 0.0; i <= 360.0; i += 1) {
        let pt = (i * Math.PI) / 180;
        if (shape === 'C') verts = verts.concat([Math.cos(pt) / 2, Math.sin(pt) / 2, 0, 0]);
        if (shape === 'E') verts = verts.concat([(a * Math.cos(pt)), (b * Math.sin(pt)), 0, 0]);
    }

    return verts;
}

function initVertexBuffers(gl, shape) {
    let n = -1, verts;

    if (shape === 'T') {
        n = 3;
        verts = new Float32Array(pts_triangle);

    } else if (shape === 'S') {
        n = 6;
        verts = new Float32Array(pts_square);
    } else if (shape === 'C') {
        n = pts_circle.length / 2;
        verts = new Float32Array(pts_circle);
    } else if (shape === 'E') {
        n = pts_ellipse.length / 2;
        verts = new Float32Array(pts_ellipse);
    }
    let vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) alert('Failed to create the buffer object');
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    attr_pos = gl.getAttribLocation(gl.program, 'a_pos');
    if (attr_pos < 0) alert('Failed to get the storage location of a_pos');
    gl.vertexAttribPointer(attr_pos, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attr_pos);

    return n;
}