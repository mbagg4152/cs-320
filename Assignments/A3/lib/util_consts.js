/*************************************************************************************************************
 * Functions - Simple
 *************************************************************************************************************/
function clog(text) { console.log(text); } // rename console.log
function elem(id) { return document.getElementById(id); } // rename document.getElementById

/*************************************************************************************************************
 * Functions - Set/Change/Convert values
 *************************************************************************************************************/
function make_vec4_color(color_hex) { // hex --> decimal --> vec4: #RRGGBB --> R,G,B --> (R/255),(G/255),(B/255)
    let color_copy = color_hex;
    color_copy = color_copy.replace('#', '');
    return [to_vec4(color_copy, 0, 1), to_vec4(color_copy, 2, 3), to_vec4(color_copy, 4, 5), 1.0];
}

function to_vec4(line, idx0, idx1) { // get hex for R, G or B based on index values then divide by 255
    return (parseInt([line.charAt(idx0), line.charAt(idx1)].join(''), 16) / 255.0).toFixed(5);
}

function make_round_points(shape, a, b) {
    let verts = [];
    for (let i = 0.0; i <= 360.0; i += 1) {
        let pt = (i * Math.PI) / 180;
        if (shape === 'C') verts = verts.concat([Math.cos(pt) / 2, Math.sin(pt) / 2, 0, 0]);
        if (shape === 'E') verts = verts.concat([(a * Math.cos(pt)), (b * Math.sin(pt)), 0, 0]);
    }
    return verts;
}

/*************************************************************************************************************
 * Functions - Dealing with WebGL
 *************************************************************************************************************/
function make_buff(gl, arr_type, buff_arr_vals, usage) {
    let buffer = gl.createBuffer();
    gl.bindBuffer(arr_type, buffer);
    gl.bufferData(arr_type, buff_arr_vals, usage);
    return buffer;
}

function init_buffers(gl, shape, grad) {
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

    if (grad) {

    } else {
        let vert_buff = make_buff(gl, gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
        if (!vert_buff) clog('Failed to create the buffer object');
        gl.bindBuffer(gl.ARRAY_BUFFER, vert_buff);

        try { attr_pos = gl.getAttribLocation(gl.program, 'a_pos'); } catch (e) { clog('POS ERR\n' + e);}
        gl.vertexAttribPointer(attr_pos, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attr_pos);
    }

    return n;
}
/*************************************************************************************************************
 * Constants
 *************************************************************************************************************/
const src_vert = 'attribute vec4 a_pos; uniform vec4 u_trans; ' +
                 'void main() { gl_Position = a_pos + u_trans; }'

const src_frag = 'precision mediump float; uniform vec4 l_color; ' +
                 'void main() { gl_FragColor = l_color; }'

const src_frag_tri = 'precision mediump float; uniform vec2 u_resolution; void main() { ' +
                     'vec2 st = gl_FragCoord.xy/u_resolution.xy; vec3 color1 = vec3(1.9,0.55,0); ' +
                     'vec3 color2 = vec3(0.226,0.000,0.615); float mixValue = distance(st,vec2(0,1)); ' +
                     'vec3 color = mix(color1,color2,mixValue); gl_FragColor = vec4(color,mixValue); }';

const src_grad_frag = 'varying lowp vec4 v_color; void main(void){' +
                      ' gl_FragColor = v_color; }';

const src_grad_vert = 'attribute vec3 a_pos; attribute vec4 a_color; varying lowp vec4 v_color; ' +
                      'void main(void){ gl_Position = vec4(a_pos, 1.0); v_color = a_color; }';

const grad_frag = 'precision mediump float; uniform float u_Width; uniform float u_Height;' +
                  'void main(){ gl_FragColor = vec4(gl_FragCoord.x/u_Width, 0.0, gl_FragCoord.y/u_Height, 1.0); }';

const pts_triangle = [0, 0.5, -0.5, -0.5, 0.5, -0.5];
const pts_square = [-0.3, -0.3, -0.3, 0.3, 0.3, 0.3, -0.3, -0.3, 0.3, 0.3, 0.3, -0.3];
const dark_red = '#6a0000';
const dark_green = '#184200';
const dark_blue = '#00276a';
const black = '#000000';

const tri_colors = [1, 0, 0, 1, Math.random(), Math.random(), Math.random(), 1, Math.random(), Math.random(), Math.random(), 1];
const tri_indices = [0, 1, 2];
