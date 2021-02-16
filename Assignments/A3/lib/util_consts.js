function mk_src(lines) { return lines.join('\n'); } // join code lines by \n, more readable
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

const src_frag_tri = mk_src(['precision mediump float;',
                             'uniform vec2 u_resolution;',
                             'void main() {',
                             '  vec2 st = gl_FragCoord.xy/u_resolution.xy;',
                             '  vec3 color1 = vec3(1.9,0.55,0);',
                             '  vec3 color2 = vec3(0.226,0.000,0.615);',
                             '  float mixValue = distance(st,vec2(0,1));',
                             '  vec3 color = mix(color1,color2,mixValue);',
                             '  gl_FragColor = vec4(color,mixValue);',
                             '}']);

const src_grad_frag = 'varying lowp vec4 v_color;\n' +
                      'void main(void) {\n' +
                      ' gl_FragColor = v_color;\n' +
                      '  }';
const src_grad_vert = 'attribute vec3 a_pos;\n' +
                      'attribute vec4 a_color;\n' +
                      'varying lowp vec4 v_color;\n' +
                      'void main(void) {\n' +
                      ' gl_Position = vec4(a_pos, 1.0);\n' +
                      ' v_color = a_color;\n' +
                      '  }';

const pts_triangle = [0, 0.5, -0.5, -0.5, 0.5, -0.5];
const pts_square = [-0.3, -0.3, -0.3, 0.3, 0.3, 0.3, -0.3, -0.3, 0.3, 0.3, 0.3, -0.3];
const dark_red = '#6a0000';
const dark_green = '#184200';
const dark_blue = '#00276a';
const black = '#000000';

const tri_colors = [1, 0, 0, 1, Math.random(), Math.random(), Math.random(), 1, Math.random(), Math.random(), Math.random(), 1];
const tri_indices = [0, 1, 2];

function clog(text) { console.log(text); }
function elem(id) {return document.getElementById(id);}

function make_vec4_color(color_hex) { // hex --> decimal --> vec4: #RRGGBB --> R,G,B --> (R/255),(G/255),(B/255)
    let color_copy = color_hex;
    color_copy = color_copy.replace('#', '');
    return [to_vec4(color_copy, 0, 1), to_vec4(color_copy, 2, 3), to_vec4(color_copy, 4, 5), 1.0];
}

function to_vec4(line, idx0, idx1) { // get hex for R, G or B based on index values then divide by 255
    return (parseInt([line.charAt(idx0), line.charAt(idx1)].join(''), 16) / 255.0).toFixed(5);
}



