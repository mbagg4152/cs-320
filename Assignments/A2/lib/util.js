/* THIS IS THE UTIL FILE PROVIDED BY THE BOOK */
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