/*************************************************************************************************************
 * Functions - Simple. Used by parts 1 & 2
 *************************************************************************************************************/
function clog(text) { console.log(text); } // rename console.log
function elem(id) { return document.getElementById(id); } // rename document.getElementById

/*************************************************************************************************************
 * Functions - Set/Change/Convert values. Used by parts 1 & 2
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
        if (shape === CIRCLE) verts = verts.concat([Math.cos(pt)/2, Math.sin(pt)/2, 0, 0]);
        if (shape === ELLIPSE) verts = verts.concat([(a*Math.cos(pt)), (b*Math.sin(pt)), 0, 0]);
    }
    return verts;
}

/*************************************************************************************************************
 * Functions - Dealing with WebGL. Used by parts 1 & 2
 *************************************************************************************************************/
function make_buff(gl, arr_type, buff_arr_vals, usage) {
    let buffer = gl.createBuffer();
    gl.bindBuffer(arr_type, buffer);
    gl.bufferData(arr_type, buff_arr_vals, usage);
    return buffer;
}

function init_buffers(gl, verts) {
    let n = -1;
    let vert_buff = make_buff(gl, gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    if (!vert_buff) clog('Failed to create the buffer object');
    gl.bindBuffer(gl.ARRAY_BUFFER, vert_buff);

    try { attr_pos = gl.getAttribLocation(gl.program, 'a_pos'); } catch (e) { clog('POS ERR\n' + e);}
    gl.vertexAttribPointer(attr_pos, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attr_pos);
    n = verts.length/2
    return n;
}

function config_draw(gl, shape, canvas, color_vals, v_shader, f_shader, grad_type, points, part, uni_trans, v_count) {
    try { gl = getWebGLContext(canvas); } catch (e) { alert('CTX ERR\n' + e); }
    try { initShaders(gl, v_shader, f_shader); } catch (e) { clog('SHADER ERR\n' + e); }
    try { uni_trans = gl.getUniformLocation(gl.program, 'u_trans'); } catch (e) { clog('TRANS ERR\n' + e); }
    try { v_count = init_buffers(gl, points); } catch (e) { clog('BUFF ERR\n' + e); }

    if (grad_type === BASIC) {
        try { uni_color = gl.getUniformLocation(gl.program, 'l_color'); } catch (e) { clog('COLOR ERR\n' + e); }
        gl.uniform4f(uni_color, color_vals[0], color_vals[1], color_vals[2], color_vals[3]);
    } else if (grad_type === GRADIENT || grad_type === RADIAL) {
        try { uni_height = gl.getUniformLocation(gl.program, 'u_height'); } catch (e) { clog('HEIGHT ERR:' + e); }
        try { uni_width = gl.getUniformLocation(gl.program, 'u_width'); } catch (e) { clog('WIDTH ERR:' + e); }
        gl.uniform1f(uni_width, gl.drawingBufferWidth);
        gl.uniform1f(uni_height, gl.drawingBufferHeight);
    }

    gl.uniform4f(uni_trans, shift_x, shift_y, shift_z, 0.0);
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (shape === 'S') {
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, v_count);
        if (part === 1) {
            simple_color_vert_update(gl, v4_white, pts_sq1, uni_color, v_count);
            simple_color_vert_update(gl, v4_black, pts_sq2, uni_color, v_count);
            simple_color_vert_update(gl, v4_white, pts_sq3, uni_color, v_count);
            simple_color_vert_update(gl, v4_black, pts_sq4, uni_color, v_count);
        }
        if (part === 2) {
            simple_color_vert_update(gl, v4_orange, alt_sq1, uni_color, v_count);
            simple_color_vert_update(gl, v4_yellow, alt_sq2, uni_color, v_count);
            simple_color_vert_update(gl, v4_green, alt_sq3, uni_color, v_count);
            simple_color_vert_update(gl, v4_blue, alt_sq4, uni_color, v_count);
            simple_color_vert_update(gl, v4_indigo, alt_sq5, uni_color, v_count);
            simple_color_vert_update(gl, v4_violet, alt_sq6, uni_color, v_count);
        }
    } else if (shape === 'T') gl.drawArrays(gl.TRIANGLES, 0, v_count);
    else if (shape === 'C' || shape === 'E') gl.drawArrays(gl.TRIANGLE_STRIP, 0, v_count);
}

function simple_color_vert_update(gl, color, points, uni_color, v_count) {
    try { uni_color = gl.getUniformLocation(gl.program, 'l_color'); } catch (e) { clog('COLOR ERR\n' + e); }
    gl.uniform4f(uni_color, color[0], color[1], color[2], color[3]);
    try { v_count = init_buffers(gl, points); } catch (e) { clog('BUFF ERR\n' + e); }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, v_count);
}

/*************************************************************************************************************
 * Constants
 *************************************************************************************************************/
const ELLIPSE = 'E', TRIANGLE = 'T', CIRCLE = 'C', SQUARE = 'S', RADIAL = 'R', BASIC = 'B', GRADIENT = 'G';

// vertex shader used by all objects
const SRC_VERT = 'attribute vec4 a_pos; uniform vec4 u_trans; void main() { gl_Position = a_pos + u_trans; }'

// used to color squares only
const FRAG_BASIC = 'precision mediump float; uniform vec4 l_color; ' +
                   'void main() { gl_FragColor = l_color; }'

// used to color part 1 triangle
const FRAG_GRAD_1 = 'precision mediump float; uniform float u_width; uniform float u_height; void main(){ ' +
                    'float rv = (gl_FragCoord.x/u_width)-0.15;  ' +
                    'float gv = (gl_FragCoord.y/u_height)-0.15;' +
                    'float bv = (gl_FragCoord.y/u_width)+(gl_FragCoord.x/u_height)/2.0;' +
                    'gl_FragColor = vec4(rv, gv, bv, 1.0); }';

// used to color part 2 triangle
const FRAG_GRAD_2 = 'precision mediump float; uniform float u_width; uniform float u_height; void main(){ ' +
                    'float rv = (gl_FragCoord.y/u_width)+(gl_FragCoord.x/u_height);' +
                    'float gv = (gl_FragCoord.x/u_width)-0.15;' +
                    'float bv = (gl_FragCoord.y/u_height)-0.15;' +
                    'gl_FragColor = vec4(rv, gv, bv, 1.0); }';

// used to color part circle
const FRAG_RAD_1 = 'precision mediump float; uniform float u_width; uniform float u_height;  void main(){ ' +
                   'float rv = pow(((gl_FragCoord.x)/u_width)-0.65,2.0)+pow(((gl_FragCoord.y)/u_height)-0.55,2.0); ' +
                   'gl_FragColor = vec4(-0.07*(1.0-rv*100.0), 0.0, 0.0 , 1.0); }';

// used to color part 2 ellipse
const FRAG_RAD_2 = 'precision mediump float; uniform float u_width; uniform float u_height; void main(){ ' +
                   'float gv = (gl_FragCoord.y/u_height)-0.19;' +
                   'float rbv = pow(((gl_FragCoord.x)/u_width)-0.5,2.0)+pow(((gl_FragCoord.y)/u_height)-0.5,2.0); ' +
                   'gl_FragColor = vec4(0.22*(-0.05*(1.0-rbv*370.0)), gv,-0.07*(1.0-rbv*200.0) , 1.0); }';

// // used to color part 2 circle
const FRAG_RAD_3 = 'precision mediump float; uniform float u_width; uniform float u_height; void main(){ ' +
                   'float rv = pow(((gl_FragCoord.x)/u_width)-0.25,2.0)+pow(((gl_FragCoord.y)/u_height)-0.3,2.0); ' +
                   'float gv = (gl_FragCoord.y/u_height)-0.22;' +
                   'gl_FragColor = vec4(0.8*(-0.07*(1.0-rv*100.0)), gv, 0.3*( -0.07*(1.0-rv*100.0)) , 1.0); }';

const pts_tri = [0, 0.75, -0.75, -0.75, 0.75, -0.75];
const alt_tri = [0.1, 0.9, -0.6, -0.9, 1, -0.7];

const pts_sq0 = [-0.95, -0.95, -0.95, 0.95, 0.95, 0.95, -0.95, -0.95, 0.95, 0.95, 0.95, -0.95];
const pts_sq1 = [-0.76, -0.76, -0.76, 0.76, 0.76, 0.76, -0.76, -0.76, 0.76, 0.76, 0.76, -0.76];
const pts_sq2 = [-0.57, -0.57, -0.57, 0.57, 0.57, 0.57, -0.57, -0.57, 0.57, 0.57, 0.57, -0.57];
const pts_sq3 = [-0.38, -0.38, -0.38, 0.38, 0.38, 0.38, -0.38, -0.38, 0.38, 0.38, 0.38, -0.38];
const pts_sq4 = [-0.19, -0.19, -0.19, 0.19, 0.19, 0.19, -0.19, -0.19, 0.19, 0.19, 0.19, -0.19];

const alt_sq0 = [-0.98, -0.98, -0.98, 0.98, 0.98, 0.98, -0.98, -0.98, 0.98, 0.98, 0.98, -0.98];
const alt_sq1 = [-0.84, -0.84, -0.84, 0.84, 0.84, 0.84, -0.84, -0.84, 0.84, 0.84, 0.84, -0.84];
const alt_sq2 = [-0.70, -0.70, -0.70, 0.70, 0.70, 0.70, -0.70, -0.70, 0.70, 0.70, 0.70, -0.70];
const alt_sq3 = [-0.56, -0.56, -0.56, 0.56, 0.56, 0.56, -0.56, -0.56, 0.56, 0.56, 0.56, -0.56];
const alt_sq4 = [-0.42, -0.42, -0.42, 0.42, 0.42, 0.42, -0.42, -0.42, 0.42, 0.42, 0.42, -0.42];
const alt_sq5 = [-0.28, -0.28, -0.28, 0.28, 0.28, 0.28, -0.28, -0.28, 0.28, 0.28, 0.28, -0.28];
const alt_sq6 = [-0.14, -0.14, -0.14, 0.14, 0.14, 0.14, -0.14, -0.14, 0.14, 0.14, 0.14, -0.14];

const v4_dk_red = vec4('#8d0000');
const v4_white = vec4('#ffffff');
const v4_black = vec4('#000000');
const v4_red = vec4('#990000');
const v4_orange = vec4('#de5f00');
const v4_yellow = vec4('#fab500');
const v4_green = vec4('#17a33f');
const v4_blue = vec4('#05517b');
const v4_indigo = vec4('#2906c4');
const v4_violet = vec4('#420086');


