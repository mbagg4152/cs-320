/*************************************************************************************************************
 * Functions - Simple
 *************************************************************************************************************/
function clog(text) { console.log(text); } // rename console.log
function elem(id) { return document.getElementById(id); } // rename document.getElementById

/*************************************************************************************************************
 * Functions - Set/Change/Convert values
 *************************************************************************************************************/
function vec4(color_hex) { // hex --> decimal --> vec4: #RRGGBB --> R,G,B --> (R/255),(G/255),(B/255)
    let color_copy = color_hex;
    color_copy = color_copy.replace('#', '');
    return [hex_vec4(color_copy, 0, 1), hex_vec4(color_copy, 2, 3), hex_vec4(color_copy, 4, 5), 1.0];
}

function hex_vec4(line, idx0, idx1) { // get hex for R, G or B based on index values then divide by 255
    return (parseInt([line.charAt(idx0), line.charAt(idx1)].join(''), 16)/255.0).toFixed(5);
}

function make_round_points(shape, a, b) {
    let verts = [];
    for (let i = 0.0; i <= 360.0; i += 1) {
        let pt = (i*Math.PI)/180;
        if (shape === 'C') verts = verts.concat([Math.cos(pt)/2, Math.sin(pt)/2, 0, 0]);
        if (shape === 'E') verts = verts.concat([(a*Math.cos(pt)), (b*Math.sin(pt)), 0, 0]);
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
        n = pts_circle.length/2;
        verts = new Float32Array(pts_circle);
    } else if (shape === 'E') {
        n = pts_ellipse.length/2;
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

const grad_frag = 'precision mediump float; uniform float u_width; uniform float u_height; ' +
                  'void main(){ ' +
                  'float rv = (gl_FragCoord.x/u_width)-0.15;  float gv = (gl_FragCoord.y/u_height)-0.15;' +
                  'float bv = (gl_FragCoord.y/u_width)+(gl_FragCoord.x/u_height)/2.0;' +
                  'gl_FragColor = vec4(rv, gv,bv , 1.0); }';

const rad_frag = 'precision mediump float; uniform float u_width; uniform float u_height; ' +
                 'void main(){ ' +
                 'float rv = pow(((gl_FragCoord.x)/u_width)-0.65,2.0)+pow(((gl_FragCoord.y)/u_height)-0.55,2.0); ' +
                 'gl_FragColor = vec4(-0.07*(1.0-rv*100.0), 0.0,0.0 , 1.0); }';

const pts_triangle = [0, 0.5, -0.5, -0.5, 0.5, -0.5];
const pts_square = [-0.7, -0.7, -0.7, 0.7, 0.7, 0.7, -0.7, -0.7, 0.7, 0.7, 0.7, -0.7];

const v4_red = vec4('#8d0000'), v4_green = vec4('#184200'), v4_blue = vec4('#00276a'), v4_black = vec4('#000000');

const ELL = 'E', TRI = 'T', CIRC = 'C', SQRE = 'S';
const RAD = 'R', BASIC = 'B', GRAD = 'G';
