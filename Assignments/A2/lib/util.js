/* THIS IS THE UTIL FILE PROVIDED BY THE BOOK
*  Added some functions */

/********************************************************
 * Added code
 ********************************************************/
function elem(id) { return document.getElementById(id); } // rename function to get document elements

function code_lines(lines) { return lines.join('\n'); } // join code lines by \n, more readable

function update_canvas(gl, points, a_pos, count, l_color, c_val) { // take points from mouse click and add to canvas
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform4f(l_color, c_val[0], c_val[1], c_val[2], c_val[3]);
    if (count === 1) { // need to draw start point of line
        gl.vertexAttrib3f(a_pos, points[0], points[1], 0.0);
        gl.drawArrays(gl.POINTS, 0, 1);
    } else { // update canvas with lines
        let res;
        try { res = config_vertex_buffers(gl, a_pos, points, count);} catch (e) { alert('FAILED TO SET POS'); }
        gl.drawArrays(gl.LINE_STRIP, 0, res);
    }
}

function config_vertex_buffers(gl, a_pos, points, count) {
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

/********************************************************
 * Original code
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