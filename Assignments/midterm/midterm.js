/*
 * Graphics Midterm - Maggie Horton
 */

const SRC_VERT = 'attribute vec4 a_pos; void main() {  gl_Position = a_pos; }';
const SRC_FRAG = 'precision mediump float; uniform vec4 u_color; void main() { gl_FragColor = u_color; }';

let tri1_verts = [0, 0.8, -0.8, -0.8, 0.8, -0.8], tri2_verts = [1, 0.7, -1, -1, 1, -1];
let canvas1 = elem('canvas1'), canvas2 = elem('canvas2'), gl1, gl2, u_color, a_pos, v_count;
let color1 = vec4('#b10550'), color5 = vec4('#134d79');

function main() {
    gl1 = getWebGLContext(canvas1);
    initShaders(gl1, SRC_VERT, SRC_FRAG);
    a_pos = gl1.getAttribLocation(gl1.program, 'a_pos');
    v_count = init_vbuff(gl1, tri1_verts);
    u_color = gl1.getUniformLocation(gl1.program, 'u_color');
    gl1.uniform4f(u_color, color1[0], color1[1], color1[2], color1[3]);
    gl1.clearColor(1, 1, 1, 1);
    gl1.clear(gl1.COLOR_BUFFER_BIT);
    gl1.drawArrays(gl1.TRIANGLES, 0, v_count);

    gl2 = getWebGLContext(canvas2);
    initShaders(gl2, SRC_VERT, SRC_FRAG);
    a_pos = gl2.getAttribLocation(gl2.program, 'a_pos');
    v_count = init_vbuff(gl2, tri2_verts);
    u_color = gl2.getUniformLocation(gl2.program, 'u_color');
    gl2.uniform4f(u_color, color5[0], color5[1], color5[2], color5[3]);
    gl2.clearColor(1, 1, 1, 1);
    gl2.clear(gl2.COLOR_BUFFER_BIT);
    gl2.drawArrays(gl2.TRIANGLES, 0, v_count);
}

function init_vbuff(gl, points) {
    let verts = -1;
    let v_buff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, v_buff);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_pos);
    verts = points.length/2
    return verts;
}

function elem(id) { return document.getElementById(id); } // rename document.getElementById

function vec4(color_hex) { // hex --> decimal --> vec4: #RRGGBB --> R,G,B --> (R/255),(G/255),(B/255)
    let color_copy = color_hex;
    color_copy = color_copy.replace('#', '');
    return [hex_vec4(color_copy, 0, 1), hex_vec4(color_copy, 2, 3), hex_vec4(color_copy, 4, 5), 1.0];
}

function hex_vec4(line, idx0, idx1) { // get hex for R, G or B based on index values then divide by 255
    return (parseInt([line.charAt(idx0), line.charAt(idx1)].join(''), 16)/255.0).toFixed(5);
}