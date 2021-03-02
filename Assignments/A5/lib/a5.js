// Maggie Horton - Graphics Assignment 5 Winter 2021
const SRC_VERT = 'attribute vec4 a_pos;  attribute vec4 a_col;  uniform mat4 u_vm; uniform mat4 u_pm; varying vec4 v_col;' +
                 'void main() {  gl_Position = u_pm * u_vm * a_pos; v_col = a_col; }';
const SRC_FRAG = 'precision mediump float; varying vec4 v_col; void main() {  gl_FragColor = v_col; }';

const sk_c1 = vec3('#00a3ff'), sk_c2 = vec3('#1671fa'), sk_c3 = vec3('#6b1efa'), sk_c4 = vec3('#52c9ff'), // sky colors
    gnd_c1 = vec3('#035c52'), gnd_c2 = vec3('#01660f'), gnd_c3 = vec3('#3c6f03'), // ground colors
    bt_c1 = vec3('#2d5500'), bt_c2 = vec3('#2a3101'), bt_c3 = vec3('#2a3100'), // background tree colors
    ft_c1 = vec3('#03804e'), ft_c2 = vec3('#022d49'), ft_c3 = vec3('#022d49'), // foreground tree colors
    s_c1 = vec3('#ffba03'), s_c2 = vec3('#d14914'); // sun-face colors

let canvas = elem('wgl_canvas');
let wgl_ctx, v_matrix, p_matrix, a_position, a_color, u_view, u_proj;
let n_vert = 3, n_col = 3, init_vb_res = 0, size_mult = 6; // vals per point, vals per color, result of init buffer
let tri_vtx = 3, sq_vtx = 6, face_vtx = 30; // v_count for triangle, rect and sun-face
let z_tr1 = 0.0, z_tr2 = 0.8, z_sky = -6, z_gnd = -6.6, z_sun = -1.7; // z vals for each object

// each point has x,y,z,r,g,b values
let bg_tree_pts = [].concat([0.15, 1.0, z_tr1], bt_c1, [-0.35, -1.0, z_tr1], bt_c2, [0.65, -1.0, z_tr1], bt_c3);
let fg_tree_pts = [].concat([0.35, 1.0, z_tr2], ft_c1, [-0.15, -1.0, z_tr2], ft_c2, [0.85, -1.0, z_tr2], ft_c3);

let sky_pts = [].concat([-4.0, -1.37, z_sky], sk_c1, [-4.0, 4.0, z_sky], sk_c2, [4.0, 4.0, z_sky], sk_c3,
                        [-4.0, -1.37, z_sky], sk_c4, [4.0, 4.0, z_sky], sk_c3, [4.0, -1.37, z_sky], sk_c1);

let ground_pts = [].concat([4.0, 0.0, z_gnd], gnd_c1, [4.0, -4.0, z_gnd], gnd_c1, [-4.0, -4.0, z_gnd], gnd_c1,
                           [4.0, 0.0, z_gnd], gnd_c3, [-4.0, -4.0, z_gnd], gnd_c1, [-4.0, 0.0, z_gnd], gnd_c2);

let sun_face_pts = [].concat([-1.0, 0.0, z_sun], s_c1, [-0.7, 0.4, z_sun], s_c1, [0.55, 0.0, z_sun], s_c2,
                             [-0.75, -0.15, z_sun], s_c1, [-0.65, 0.0, z_sun], s_c1, [-0.65, -0.25, z_sun], s_c1,
                             [-0.65, -0.4, z_sun], s_c1, [-0.7, -0.3, z_sun], s_c1, [-0.65, -0.25, z_sun], s_c1,
                             [-0.3, -0.5, z_sun], s_c1, [-0.65, -0.4, z_sun], s_c1, [-0.65, 0.0, z_sun], s_c1,
                             [-0.7, -0.6, z_sun], s_c1, [-0.65, -0.4, z_sun], s_c1, [-0.3, -0.5, z_sun], s_c1,
                             [-0.3, -0.5, z_sun], s_c1, [-0.65, 0.0, z_sun], s_c1, [0.55, 0.0, z_sun], s_c2,
                             [0.0, 0.15, z_sun], s_c2, [0.7, 0.5, z_sun], s_c1, [0.55, 0.0, z_sun], s_c2,
                             [0.0, 0.15, z_sun], s_c2, [0.3, 0.9, z_sun], s_c1, [0.7, 0.5, z_sun], s_c1,
                             [0.0, 0.15, z_sun], s_c2, [-0.4, 0.9, z_sun], s_c1, [0.3, 0.9, z_sun], s_c1,
                             [0.0, 0.15, z_sun], s_c2, [-0.4, 0.9, z_sun], s_c1, [-0.7, 0.4, z_sun], s_c1);

function main() {
    setup_webgl();
    init_vb_res = init_vbuff(wgl_ctx, n_vert, n_col, sky_pts);
    wgl_ctx.drawArrays(wgl_ctx.TRIANGLE_STRIP, 0, sq_vtx); // draw sky rectangle
    init_vb_res = init_vbuff(wgl_ctx, n_vert, n_col, sun_face_pts);
    wgl_ctx.drawArrays(wgl_ctx.TRIANGLES, 0, face_vtx); // draw sun-face
    init_vb_res = init_vbuff(wgl_ctx, n_vert, n_col, bg_tree_pts);
    wgl_ctx.drawArrays(wgl_ctx.TRIANGLES, 0, tri_vtx); // draw first tree
    init_vb_res = init_vbuff(wgl_ctx, n_vert, n_col, fg_tree_pts);
    wgl_ctx.drawArrays(wgl_ctx.TRIANGLES, 0, tri_vtx); // draw second tree
}

function setup_webgl() {
    v_matrix = new Matrix4();
    p_matrix = new Matrix4();
    wgl_ctx = getWebGLContext(canvas);
    initShaders(wgl_ctx, SRC_VERT, SRC_FRAG);
    init_vb_res = init_vbuff(wgl_ctx, n_vert, n_col, ground_pts, sq_vtx); // setup buffer

    u_view = wgl_ctx.getUniformLocation(wgl_ctx.program, 'u_vm'); // uniform view matrix
    u_proj = wgl_ctx.getUniformLocation(wgl_ctx.program, 'u_pm'); // uniform projection matrix
    v_matrix.setLookAt(0, 0, 3, 0, 0, -400, 0, 8, 0); // setup view
    p_matrix.setPerspective(45, canvas.width/canvas.height, 1, 500); // set perspective
    wgl_ctx.uniformMatrix4fv(u_view, false, v_matrix.elements); // send view to shader
    wgl_ctx.uniformMatrix4fv(u_proj, false, p_matrix.elements); // send projection to shader

    wgl_ctx.clearColor(1.0, 1.0, 1.0, 1.0);
    wgl_ctx.clear(wgl_ctx.COLOR_BUFFER_BIT);
    wgl_ctx.drawArrays(wgl_ctx.TRIANGLE_STRIP, 0, sq_vtx); // draw ground rectangle
}

function init_vbuff(gl, vert_num, col_num, points, n) { // set up vertex buffer for webgl
    let vbuff = gl.createBuffer(), f_points = new Float32Array(points);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuff);
    gl.bufferData(gl.ARRAY_BUFFER, f_points, gl.STATIC_DRAW);
    let B_SIZE = f_points.BYTES_PER_ELEMENT;

    a_position = gl.getAttribLocation(gl.program, 'a_pos');
    gl.vertexAttribPointer(a_position, n_vert, gl.FLOAT, false, B_SIZE*size_mult, 0); // send a_pos val to shader
    gl.disableVertexAttribArray(a_position);
    gl.enableVertexAttribArray(a_position);

    a_color = gl.getAttribLocation(gl.program, 'a_col');
    gl.vertexAttribPointer(a_color, col_num, gl.FLOAT, false, B_SIZE*size_mult, B_SIZE*vert_num); // send a_col val to shader
    gl.disableVertexAttribArray(a_color);
    gl.enableVertexAttribArray(a_color);

    return n;
}