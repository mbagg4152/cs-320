// color arrays set up as: [R/255, G/255, B/255, Opacity]
const RED = [0.6, 0.0, 0.0, 1.0];
const ORANGE = [0.8706, 0.3725, 0.0, 1.0];
const YELLOW = [0.9804, 0.7098, 0.0, 1.0];
const GREEN = [0.0902, 0.6392, 0.2471, 1.0];
const BLUE = [0.0196, 0.3176, 0.4824, 1.0];
const VIOLET = [0.2588, 0.0, 0.5225, 1.0];

const VSHADER = 'attribute vec4 vertexPos; ' +
                'uniform vec4 shift; ' +
                'void main() { ' +
                '  gl_Position = vertexPos + shift; ' +
                '}'
const FSHADER = 'precision mediump float; ' +
                'uniform vec4 fragColor; ' +
                'void main() { ' +
                '    gl_FragColor = fragColor; ' +
                '}'
let circPoints = getCirclePoints();
let octaPoints = getOctagonPoints();
let ovalPoints = getOvalPoints(0.9, 0.7);
let pentPoints = getPentagonPoints();
let squarePoints = [-1, -1, -1, 1, 1, 1, -1, -1, 1, 1, 1, -1];
let triPoints = [0, 1, -1, -1, 1, -1];

let c1 = document.getElementById('c1');
let c2 = document.getElementById('c2');
let c3 = document.getElementById('c3');
let c4 = document.getElementById('c4');
let c5 = document.getElementById('c5');
let c6 = document.getElementById('c6');

let glCtx1;
let glCtx2;
let glCtx3;
let glCtx4;
let glCtx5;
let glCtx6;
let glslColorLoc;
let glslPositionLoc;
let glslTransformationLoc;
let moveX = 0.0;
let moveY = 0.0;
let moveZ = 0.0;
let vertexCount;

function main() {
    drawOnCanvas(glCtx1, c1, RED, ovalPoints, vertexCount);
    drawOnCanvas(glCtx2, c2, ORANGE, triPoints, vertexCount);
    drawOnCanvas(glCtx3, c3, YELLOW, circPoints, vertexCount);
    drawOnCanvas(glCtx4, c4, GREEN, squarePoints, vertexCount);
    drawOnCanvas(glCtx5, c5, BLUE, pentPoints, vertexCount);
    drawOnCanvas(glCtx6, c6, VIOLET, octaPoints, vertexCount);
}

function drawOnCanvas(glCtx, canvas, color, points, pointCounter) {
    glCtx = getWebGLContext(canvas); // get canvas context
    initShaders(glCtx, VSHADER, FSHADER); // attach shaders
    glslTransformationLoc = glCtx.getUniformLocation(glCtx.program, 'shift'); // get transformation variable from shader
    pointCounter = makeVertexBuffers(glCtx, points); // get point count after initializing buffers
    glslColorLoc = glCtx.getUniformLocation(glCtx.program, 'fragColor'); // get glsl color variable
    glCtx.uniform4f(glslColorLoc, color[0], color[1], color[2], color[3]); // change color

    glCtx.uniform4f(glslTransformationLoc, moveX, moveY, moveZ, 0.0); // set translation
    glCtx.clearColor(1, 1, 1, 1); // set clear color of canvas
    glCtx.clear(glCtx.COLOR_BUFFER_BIT); // clear canvas

    // different shapes have different webgl drawing modes
    if (pointCounter === 6) { // square
        glCtx.drawArrays(glCtx.TRIANGLE_STRIP, 0, pointCounter);
    } else if (pointCounter === 3) { // triangle
        glCtx.drawArrays(glCtx.TRIANGLES, 0, pointCounter);
    } else { // circle, ellipse, octagon, pentagon
        glCtx.drawArrays(glCtx.TRIANGLE_STRIP, 0, pointCounter);
    }
}

function makeVertexBuffers(glCtx, points) {
    let n = -1; // default to this in case of error
    let vBuffer = glCtx.createBuffer(); // create vertex buffer

    glCtx.bindBuffer(glCtx.ARRAY_BUFFER, vBuffer); // bind buffer
    glCtx.bufferData(glCtx.ARRAY_BUFFER, new Float32Array(points), glCtx.STATIC_DRAW); // fill buffer with data (must be a Float32Array)
    glslPositionLoc = glCtx.getAttribLocation(glCtx.program, 'vertexPos'); // get position variable from glsl
    glCtx.vertexAttribPointer(glslPositionLoc, 2, glCtx.FLOAT, false, 0, 0); // set up pointer
    glCtx.enableVertexAttribArray(glslPositionLoc); // enable buffer/pointer
    n = points.length/2 // number of points
    return n;
}

function getCirclePoints() {
    let pts = [];
    for (let i = 0.0; i <= 360.0; i += 1) {
        let theta = i*Math.PI/180;
        pts = pts.concat([Math.cos(theta), Math.sin(theta), 0, 0]); // outer x, outer y, inner x, inner y
    }
    return pts;
}

function getOvalPoints(a, b) {
    let pts = [];
    for (let i = 0.0; i <= 360.0; i += 1) {
        let theta = (i*Math.PI)/180;
        pts = pts.concat([(a*Math.cos(theta)), (b*Math.sin(theta)), 0, 0]); // outer x, outer y, inner x, inner y
    }
    return pts;
}

function getOctagonPoints() {
    let pts = [];
    for (let i = 0.0; i <= 8.0; i += 1) {
        let theta = i*(2*Math.PI)/8;
        pts = pts.concat([Math.cos(theta), Math.sin(theta), 0, 0]); // outer x, outer y, inner x, inner y
    }
    return pts;
}

function getPentagonPoints() {
    let pts = [];
    for (let i = 0.0; i <= 5.0; i += 1) {
        let theta = i*(2*Math.PI)/5;
        pts = pts.concat([Math.cos(theta), Math.sin(theta), 0, 0]); // outer x, outer y, inner x, inner y
    }
    return pts;
}