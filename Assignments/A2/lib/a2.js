// import './util';

function elem(id) {return document.getElementById(id);}
const NLS = '\n;', S_SRC = 'void main(){\n', E_SRC = '}\n';

/********************************************************
 * Shaders
 ********************************************************/
let SRC_VERT =
    'attribute vec4 a_pos' + NLS +
    S_SRC +
    '  gl_Position = a_pos' + NLS +
    '  gl_PointSize = 10.0' + NLS +
    E_SRC;

let SRC_FRAG = 'void main() {\n' +
    '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
    '}\n';

/********************************************************
 * JS code
 ********************************************************/
let gl,
    main_ctx,
    canvas,
    head_xy,
    head_left,
    head_right,
    clk_x,
    clk_y,
    cnt_right,
    cnt_left;
let a_pos;
let points = [];

function main() {
    // document elements
    canvas = elem('main_canvas');
    head_xy = elem('head_xy');
    head_left = elem('head_left');
    head_right = elem('head_right');
    cnt_right = 0;
    cnt_left = 0;

    try { // get webgl context
        gl = getWebGLContext(canvas);
    } catch (e) {
        alert('PROBLEM LOADING WEBGL CONTEXT\n' + e);
    }
    main_ctx = canvas.getContext('2d');

    try { // try to load shaders
        initShaders(gl, SRC_VERT, SRC_FRAG)
    } catch (e) {
        alert('ERR LOADING SHADERS\n' + e);
    }

    try { // Get the storage location of a_pos
        a_pos = gl.getAttribLocation(gl.program, 'a_pos');
    } catch (e) {
        alert('Failed to get the storage location of a_pos\n' + e);
    }

    canvas.onclick = function (event_left) { left_click(event_left); }
    canvas.oncontextmenu = function (event_right) { right_click(event_right); }
}

function left_click(event_left) {
    let x = event_left.clientX, y = event_left.clientY, area = event_left.target.getBoundingClientRect();
    clk_x = ((x - area.left) - canvas.width / 2) / (canvas.width / 2);
    clk_y = (canvas.height / 2 - (y - area.top)) / (canvas.height / 2);

    head_xy.innerText = '(' + clk_x + ',' + clk_y + ')';
    cnt_left += 1;
    head_left.innerText = 'left click count: ' + cnt_left;

    points.push(clk_x);
    points.push(clk_y);
    update_points();
}

function right_click(event_right) {
    event_right.preventDefault();
    points = [];
    update_points();
    cnt_left = 0;
    head_left.innerText = 'left click count: ' + cnt_left;
    cnt_right += 1;
    head_right.innerText = 'right click count: ' + cnt_right;
}

function update_points() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    let p_len = points.length;
    for (let i = 0; i < p_len; i += 2) {
        gl.vertexAttrib3f(a_pos, points[i], points[i + 1], 0.0);
        gl.drawArrays(gl.POINTS, 0, 1);

    }
}