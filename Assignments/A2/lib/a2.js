// Maggie Horton Winter 2021
// TODO - CHANGE VAR NAMES
// TODO - PROB DONT USE SNAKE CASE NAMES

// TODO - i renamed the vars here, feel free to change it still if u want
const vShaderCode = 'attribute vec4 vShaderPoints; void main(){ gl_Position = vShaderPoints; gl_PointSize = 10.0; }';
const fShaderCode = 'precision mediump float; uniform vec4 fragColor; void main() { gl_FragColor = fragColor; }';

// TODO - could have a separate let statement on each line. also could opt out of using global vars and modify functions to pass values
// TODO - also could change let to var i think?
let
    gl,
    drawingCanvas,
    noOfPoints,
    vec4Points,
    vec4Color,
    colorInput,
    inputLabel,
    lineColor,
    vec4LineColorArr;

let points = [];

// TODO - i dont think you need to have this bitch be called main. just whatever you change it to, make sure to update it in the html to have this launch on load
function main() {
    drawingCanvas = document.getElementById('drawSpace');
    colorInput = document.getElementById('colorInput');
    inputLabel = document.getElementById('inputLabel');
    noOfPoints = 0;
    lineColor = '#1a7bd5'; // TODO - CHANGE COLOR VALUE
    colorInput.value = lineColor;
    gl = getWebGLContext(drawingCanvas);
    initShaders(gl, vShaderCode, fShaderCode);
    vec4Points = gl.getAttribLocation(gl.program, 'vShaderPoints');
    vec4Color = gl.getUniformLocation(gl.program, 'fragColor');
    vec4LineColorArr = makeWebglColor();
    drawingCanvas.onclick = function (event_left) { left_click(event_left); }
    drawingCanvas.oncontextmenu = function (event_right) { eraseDrawing(event_right); }
    colorInput.onchange = function () { getColorInput(); }

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // TODO - idk if this line needs to go here
    gl.uniform4f(vec4Color, vec4LineColorArr[0], vec4LineColorArr[1], vec4LineColorArr[2], vec4LineColorArr[3]);
}

function left_click(press) {
    noOfPoints += 1;
    // TODO - idk how to change this that much but pls try ur darndest
    // get coords based on canvas size & then convert to webgl coords
    let x = (press.offsetX / drawingCanvas.clientWidth) * 2 - 1;
    let y = ((drawingCanvas.clientHeight - press.offsetY) / drawingCanvas.clientHeight) * 2 - 1;

    // add mouse click points to point array
    points.push(x);
    points.push(y);
    update(gl, points, vec4Points, noOfPoints, vec4Color, vec4LineColorArr);
}

function eraseDrawing(press) {
    // TODO - maybe can remove this? idk how itll affect it if popup still happens
    press.preventDefault(); // prevent right-click context menu from popping up
    points.splice(0, points.length); // clear points from mouse click
    noOfPoints = 0;
    update(gl, points, vec4Points, noOfPoints, vec4Color, vec4LineColorArr);
}

function getColorInput() {
    lineColor = colorInput.value;
    let vec4 = makeWebglColor();
    vec4LineColorArr = vec4;
    update(gl, points, vec4Points, noOfPoints, vec4Color, vec4);
}

// TODO -not needed but helpful to avoid reusing code a lot. change params & param order pls dont need count, can just divide length of points by 2
function update(gl, points, vShaderPoints, count, fragColor, c_val) { // update canvas w/ current vertex points
    gl.clear(gl.COLOR_BUFFER_BIT);
    let res = setupBuff(gl, vShaderPoints, points, count);
    gl.uniform4f(fragColor, c_val[0], c_val[1], c_val[2], c_val[3]);
    gl.drawArrays(gl.LINE_STRIP, 0, res);
}

// TODO - def needed for drawing the lines. maybe figure out how to draw just a point?
function setupBuff(gl, vShaderPoints, points, count) { // sets up buffer to make lines
    let verts = new Float32Array(points);
    let vert_buff = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vert_buff);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    gl.vertexAttribPointer(vShaderPoints, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vShaderPoints);
    return count;
}

// TODO - not needed but shortens lines. conversion from hex to vec4 is necessary
function makeWebglColor() { // hex --> decimal --> vec4: #RRGGBB --> R,G,B --> (R/255),(G/255),(B/255)
    let copy = lineColor;
    copy = copy.replace('#', '');
    return [hexToVec4(copy, 0, 1), hexToVec4(copy, 2, 3), hexToVec4(copy, 4, 5), 1.0];
}

// TODO - could just be done in previous function i guess
function hexToVec4(line, idx0, idx1) { // get hex for R, G or B based on index values then divide by 255
    return (parseInt([line.charAt(idx0), line.charAt(idx1)].join(''), 16) / 255.0).toFixed(5);
}