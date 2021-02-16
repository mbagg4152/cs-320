// Modified version of util_consts.js (c) 2012 kanda and matsuda
function initShaders(gl, vshader, fshader) { // Create a program object and make current
    if (!vshader || !fshader) {
        if (!vshader) clog('initShaders: vshader null');
        if (!fshader) clog('initShaders: fshader null');
        return false;
    }
    let program = createProgram(gl, vshader, fshader);
    if (!program) {
        clog('Failed to create program');
        return false;
    }

    gl.useProgram(program);
    gl.program = program;
    return true;
}

function createProgram(gl, vshader, fshader) { // Create the linked program object
    let vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader); // Create shader object
    let fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
    if (!vertexShader || !fragmentShader) {
        if (!vertexShader) clog('createProgram: vshader null');
        if (!fragmentShader) clog('createProgram: fshader null');
        return null;
    }

    let program = gl.createProgram(); // Create a program object
    if (!program) return null;

    gl.attachShader(program, vertexShader); // Attach the shader objects
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);  // Link the program object

    let linked = gl.getProgramParameter(program, gl.LINK_STATUS);  // Check the result of linking
    if (!linked) {
        let error = gl.getProgramInfoLog(program);
        clog('Failed to link program: ' + error);
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
        return null;
    }
    return program;
}

function loadShader(gl, type, source) { // Create a shader object
    let shader = gl.createShader(type); // Create shader object
    if (shader == null) {
        console.log('unable to create shader');
        return null;
    }

    gl.shaderSource(shader, source); // Set the shader program
    gl.compileShader(shader);  // Compile the shader
    let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);   // Check the result of compilation
    if (!compiled) {
        let error = gl.getShaderInfoLog(shader);
        console.log('Failed to compile shader: ' + error);
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function getWebGLContext(canvas, opt_debug) { // Initialize and get the rendering for WebGL
    let gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) return null;
    if (arguments.length < 2 || opt_debug) gl = WebGLDebugUtils.makeDebugContext(gl);
    return gl;
}