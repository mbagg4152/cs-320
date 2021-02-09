/*  Maggie Horton Winter 2021
 *  THIS IS THE BUILT ON THE UTIL FILE PROVIDED BY THE BOOK (cuon-utils.js)
 *  Added some functions */

/**********************************************************************
 * Added code
 * Move added code to another file or just to the main
 * file and then just use the cuon-utils.js file from
 * the book. got this version by going to
 * http://rodger.global-linguist.com/webgl/ch02/ClickedPoints.html
 * and just saving the webpage. folder of assets should be downloaded.
 **********************************************************************/
// TODO - CHANGE VAR NAMES
// TODO - PROB DONT USE SNAKE CASE NAMES

// TODO - not needed
function elem(id) { return document.getElementById(id); } // rename function to get document elements

// TODO - not needed
function code_lines(lines) { return lines.join('\n'); } // join code lines by \n, more readable

// TODO -not needed but helpful to avoid reusing code a lot. change params & param order pls dont need count, can just divide length of points by 2
function update_canvas(gl, points, a_pos, count, l_color, c_val) { // update canvas w/ current vertex points
    gl.clear(gl.COLOR_BUFFER_BIT);
    let res;
    // TODO - can remove try-catch
    try { res = config_vertex_buffers(gl, a_pos, points, count);} catch (e) { alert('FAILED TO SET POS'); }
    gl.uniform4f(l_color, c_val[0], c_val[1], c_val[2], c_val[3]);
    gl.drawArrays(gl.LINE_STRIP, 0, res);
}

// TODO - def needed for drawing the lines. maybe figure out how to draw just a point?
// TODO - dont need count, can just divide length of points by 2
function config_vertex_buffers(gl, a_pos, points, count) { // sets up buffer to make lines
    let verts = new Float32Array(points);
    let vert_buff;
    try {
        vert_buff = gl.createBuffer()
    } catch (e) {
        alert('FAILED MAKING VERT BUFF\n' + e);
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vert_buff);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_pos);
    return count;
}

// TODO - excess bs, not needed
function is_bright(val) { // take avg. of RGB value, return bool based on value. made from vec4 color hence * 255
    return (((val[0] * 255) + (val[1] * 255) + (val[2] * 255)) / 3).toFixed(1) > 123;
}

// TODO - not needed but shortens lines. conversion from hex to vec4 is necessary
function make_vec4_color() { // hex --> decimal --> vec4: #RRGGBB --> R,G,B --> (R/255),(G/255),(B/255)
    let color_copy = color_hex;
    color_copy = color_copy.replace('#', '');
    return [to_vec4(color_copy, 0, 1), to_vec4(color_copy, 2, 3), to_vec4(color_copy, 4, 5), 1.0];
}

// TODO - could just be done in previous function i guess
function to_vec4(line, idx0, idx1) { // get hex for R, G or B based on index values then divide by 255
    return (parseInt([line.charAt(idx0), line.charAt(idx1)].join(''), 16) / 255.0).toFixed(5);
}

// TODO - not needed, especially if not using the button to reveal the color picker
function update_style(elem_list, c_style, n_style) { // change visibility of color picker & its label
    for (let i = 0; i < elem_list.length; i++) {
        if (elem_list[i].style.display === c_style) {elem_list[i].style.display = n_style;}
    }
}

/********************************************************
 * Original code from cuon-utils.js
 ********************************************************/
if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = (window.cancelRequestAnimationFrame ||
        window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame ||
        window.mozCancelAnimationFrame || window.mozCancelRequestAnimationFrame ||
        window.msCancelAnimationFrame || window.msCancelRequestAnimationFrame ||
        window.oCancelAnimationFrame || window.oCancelRequestAnimationFrame ||
        window.clearTimeout);
}

function initShaders(gl, vshader, fshader) {
    let program = createProgram(gl, vshader, fshader);
    if (!program) {
        console.log('Failed to create program');
        return false;
    }

    gl.useProgram(program);
    gl.program = program;
    return true;
}

function createProgram(gl, vshader, fshader) {
    let vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader); // Create shader object
    let fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader); // Create shader object
    if (!vertexShader || !fragmentShader) {
        return null;
    }

    let program = gl.createProgram(); // Create a program object
    if (!program) {
        return null;
    }

    gl.attachShader(program, vertexShader); // Attach shader object
    gl.attachShader(program, fragmentShader); // Attach shader object
    gl.linkProgram(program); // Link the program object

    let linked = gl.getProgramParameter(program, gl.LINK_STATUS); // Check the result of linking
    if (!linked) {
        let error = gl.getProgramInfoLog(program);
        console.log('Failed to link program: ' + error);
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
        return null;
    }
    return program;
}

function loadShader(gl, type, source) {
    let shader = gl.createShader(type); // Create shader object
    if (shader == null) {
        console.log('unable to create shader');
        return null;
    }

    gl.shaderSource(shader, source); // Set the shader program
    gl.compileShader(shader); // Compile the shader
    let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS); // Check the result of compilation
    if (!compiled) {
        let error = gl.getShaderInfoLog(shader);
        console.log('Failed to compile shader: ' + error);
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function getWebGLContext(canvas, opt_debug) {
    let gl = WebGLUtils.setupWebGL(canvas);  // Get the rendering context for WebGL
    if (!gl) return null;
    if (arguments.length < 2 || opt_debug) { // if opt_debug is explicitly false, create the context for debugging
        gl = WebGLDebugUtils.makeDebugContext(gl);
    }
    return gl;
}