/********************************************************
 * Shaders
 ********************************************************/
let SRC_VERT = code_lines(['attribute vec4 a_pos;',
                           'void main(){',
                           '  gl_Position = a_pos;',
                           '  gl_PointSize = 2.0;',
                           '}']);

let SRC_FRAG = code_lines(['',
                           'void main() {',
                           '  gl_FragColor = vec4(1.0, 0.55, 0.17, 1.0);',
                           '}']);

/********************************************************
 * JS code
 ********************************************************/
let gl, canvas, head_xy, head_btn, cnt_btn, cnt_left, a_pos, line_color, color_btn, picker, lbl, points = [], color;

function main() {

    // document elements
    canvas = elem('main_canvas');
    head_xy = elem('head_xy');
    head_btn = elem('head_btn');
    color_btn = elem('color_btn');
    picker = elem('color_picker');
    lbl = elem('color_lbl');
    cnt_btn = 0;
    cnt_left = 0;
    color = '#450825';
    init_webgl();

    let vec4_start;
    try { vec4_start = make_vec4_color(); } catch (e) { alert(e); }
    vec4_start.push(0.0);

    register_events();

    // clear everything
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function init_webgl() { // set up webgl context, shaders, etc. and make sure program is loaded
    try { gl = getWebGLContext(canvas); } catch (e) { alert('PROBLEM LOADING WEBGL CONTEXT\n' + e); }
    try { initShaders(gl, SRC_VERT, SRC_FRAG); } catch (e) { alert('ERR LOADING SHADERS\n' + e); }
    try { a_pos = gl.getAttribLocation(gl.program, 'a_pos'); } catch (e) { alert('NO LOC FOR A_POS\n' + e); }
}

function register_events() { // register events for canvas, button and color picker
    canvas.onclick = function (event_left) { left_click(event_left); }
    canvas.oncontextmenu = function (event_right) { right_click(event_right); }
    color_btn.onclick = function (press) { color_click(press); }
    picker.onclick = function (press) { get_color(press); }
    picker.onchange = function (press) { get_color(press); }
}

function left_click(press) {
    // get coords based on canvas size & then convert to webgl coords
    let x = (press.offsetX / canvas.clientWidth) * 2 - 1;
    let y = ((canvas.clientHeight - press.offsetY) / canvas.clientHeight) * 2 - 1;

    // add mouse click points to point array
    points.push(x);
    points.push(y);

    cnt_left += 1; // for testing, remove later
    head_xy.innerText = ' left click count: ' + cnt_left + ' ~~~~ x,y: (' + x.toFixed(3) + ', ' + y.toFixed(3) + ')'; // for testing, remove later
    try {update_canvas(gl, points, a_pos, cnt_left);} catch (e) {alert('ERR UPDATING CANVAS\n' + e);}

}

function right_click(press) {
    let x = (press.offsetX / canvas.clientWidth) * 2 - 1;
    let y = ((canvas.clientHeight - press.offsetY) / canvas.clientHeight) * 2 - 1;
    press.preventDefault(); // prevent right-click context menu from popping up
    points = []; // clear points from mouse click

    cnt_left = 0; // for testing, remove later
    head_xy.innerText = ' left click count: ' + cnt_left + ' ~~~~ x,y: (' + x.toFixed(3) + ', ' + y.toFixed(3) + ')'; // for testing, remove later
    try {update_canvas(gl, points, a_pos, cnt_left);} catch (e) {alert('ERR UPDATING CANVAS\n' + e);}
}

function color_click(press) {
    if (lbl.style.display === "none") lbl.style.display = "inline-block";
    if (picker.style.display === "none") picker.style.display = "inline-block";
}

function get_color(press) {
    color = picker.value;
    make_vec4_color();

    if (lbl.style.display === "inline-block") lbl.style.display = "none";
    if (picker.style.display === "inline-block") picker.style.display = "none";
    head_btn.innerText = 'Vec4 color: ' + color;
}

function make_vec4_color() { // hex --> decimal --> vec4: #RRGGBB --> R,G,B --> (R/255),(G/255),(B/255)
    color = color.replace('#', '');
    let as_vec4 = [to_vec4(color, 0, 1), to_vec4(color, 2, 3), to_vec4(color, 0, 1)];
    color = as_vec4.join(', ');
    return as_vec4;
}

function to_vec4(line, idx0, idx1) { // get hex for R, G or B based on index values then divide by 255
    let hex = [line.charAt(idx1), line.charAt(idx0)].join('');
    return (parseInt(hex, 16) / 255.0).toFixed(3);
}
