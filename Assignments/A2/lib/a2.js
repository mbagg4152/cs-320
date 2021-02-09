function elem(id) {return document.getElementById(id);}

/********************************************************
 * Shaders
 ********************************************************/
const NLS = '\n;', S_SRC = 'void main(){\n', E_SRC = '}\n';

let SRC_VERT =
    'attribute vec4 a_pos' + NLS +
    S_SRC +
    '  gl_Position = a_pos' + NLS +
    '  gl_PointSize =2.0' + NLS +
    E_SRC;

let SRC_FRAG = 'void main() {\n' +
    '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
    '}\n';

/********************************************************
 * JS code
 ********************************************************/
let gl, canvas, head_xy, head_left, head_right, cnt_right, cnt_left, a_pos, points = [];

function main() {
    // document elements
    canvas = elem('main_canvas');
    head_xy = elem('head_xy');
    head_left = elem('head_left');
    head_right = elem('head_right');
    cnt_right = 0;
    cnt_left = 0;

    // set up webgl context, shaders and make sure program is loaded
    try { gl = getWebGLContext(canvas); } catch (e) { alert('PROBLEM LOADING WEBGL CONTEXT\n' + e); }
    try { initShaders(gl, SRC_VERT, SRC_FRAG) } catch (e) { alert('ERR LOADING SHADERS\n' + e); }
    try { a_pos = gl.getAttribLocation(gl.program, 'a_pos'); } catch (e) { alert('NO LOC FOR A_POS\n' + e); }

    // register events for left & right mouse clicks
    canvas.onclick = function (event_left) { left_click(event_left); }
    canvas.oncontextmenu = function (event_right) { right_click(event_right); }

    // clear everything
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function left_click(event_left) {
    // get coords based on canvas size & then convert to webgl coords
    let x = (event_left.offsetX / canvas.clientWidth) * 2 - 1;
    let y = ((canvas.clientHeight - event_left.offsetY) / canvas.clientHeight) * 2 - 1;

    // add mouse click points to point array
    points.push(x);
    points.push(y);

    head_xy.innerText = '(' + x + ',' + y + ')'; // for testing, remove later
    cnt_left += 1; // for testing, remove later
    head_left.innerText = 'left click count: ' + cnt_left; // for testing, remove later

    update_points();
}

function right_click(event_right) {
    event_right.preventDefault(); // prevent right-click context menu from popping up
    points = []; // clear points from mouse click
    update_points();
    cnt_left = 0; // for testing, remove later
    head_left.innerText = 'left click count: ' + cnt_left; // for testing, remove later
    cnt_right += 1; // for testing, remove later
    head_right.innerText = 'right click count: ' + cnt_right; // for testing, remove later
}

function update_points() { // take points from mouse click and add to canvas
    gl.clear(gl.COLOR_BUFFER_BIT);
    let p_len = points.length;
    for (let i = 0; i < p_len; i += 2) {
        gl.vertexAttrib3f(a_pos, points[i], points[i + 1], 0.0);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}
