/********************************************************
 * File just has constant values.
 ********************************************************/
const src_vert = mk_src(['attribute vec4 a_pos;',
                         'uniform vec4 u_trans;',
                         'void main() {',
                         '  gl_Position = a_pos + u_trans;',
                         '  gl_PointSize = 10.0;',
                         '}']);

const src_frag = mk_src(['precision mediump float;',
                         'uniform vec4 l_color;',
                         'void main() {',
                         '  gl_FragColor = l_color;',
                         '}']);

const pts_triangle = [0, 0.5, -0.5, -0.5, 0.5, -0.5];
const pts_square = [-0.3, -0.3, -0.3, 0.3, 0.3, 0.3, -0.3, -0.3, 0.3, 0.3, 0.3, -0.3];
const dark_red = '#6a0000';
const dark_green = '#184200';
const dark_blue = '#00276a';
const black = '#000000';