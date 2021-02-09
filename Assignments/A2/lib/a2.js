// Maggie Horton Winter 2021

/********************************************************
 * Shaders
 ********************************************************/
let SRC_VERT = code_lines(['attribute vec4 a_pos;',
                           'void main(){',
                           '    gl_Position = a_pos;',
                           '    gl_PointSize = 10.0;',
                           '    ',
                           '}']);

let SRC_FRAG = code_lines(['precision mediump float;',
                           'uniform vec4 l_color;',
                           'void main() {',
                           '  gl_FragColor = l_color;',
                           '}']);

/********************************************************
 * JS code
 ********************************************************/
let
    wgl_ctx,
    canvas,
    pt_count,
    attr_pos,
    attr_color,
    picker_btn,
    picker_input,
    picker_lbl,
    color_hex,
    color_array;

let points = [];
function main() {
    // document elements
    canvas = elem('main_canvas');
    picker_btn = elem('color_btn');
    picker_input = elem('color_picker');
    picker_lbl = elem('color_lbl');
    pt_count = 0;
    color_hex = '#1a7bd5';
    picker_input.value = color_hex;
    picker_btn.style.backgroundColor = color_hex;
    init_webgl();

    try { color_array = make_vec4_color(); } catch (e) { alert(e); }

    register_events();

    // clear everything
    wgl_ctx.clearColor(1.0, 1.0, 1.0, 1.0);
    wgl_ctx.clear(wgl_ctx.COLOR_BUFFER_BIT);
    wgl_ctx.uniform4f(attr_color, color_array[0], color_array[1], color_array[2], color_array[3]);
}

function init_webgl() { // set up webgl context, shaders, etc. and make sure program is loaded
    try { wgl_ctx = getWebGLContext(canvas); } catch (e) { alert('ERR - WEBGL CONTEXT'); }
    try { initShaders(wgl_ctx, SRC_VERT, SRC_FRAG); } catch (e) { alert('ERR - SHADERS'); }
    try { attr_pos = wgl_ctx.getAttribLocation(wgl_ctx.program, 'a_pos'); } catch (e) { alert('ERR - POS'); }
    try { attr_color = wgl_ctx.getUniformLocation(wgl_ctx.program, 'l_color'); } catch (e) { alert('ERR - COLOR'); }
}

function register_events() { // register events for canvas, button and color picker
    canvas.onclick = function (event_left) { left_click(event_left); }
    canvas.oncontextmenu = function (event_right) { right_click(event_right); }
    picker_btn.onclick = function () { color_click(); }
    picker_input.onclick = function () { get_color(); }
    picker_input.onchange = function () { get_color(); }
}

function left_click(press) {
    pt_count += 1;

    // get coords based on canvas size & then convert to webgl coords
    let x = (press.offsetX / canvas.clientWidth) * 2 - 1;
    let y = ((canvas.clientHeight - press.offsetY) / canvas.clientHeight) * 2 - 1;

    // add mouse click points to point array
    points.push(x);
    points.push(y);
    try {update_canvas(wgl_ctx, points, attr_pos, pt_count, attr_color, color_array);} catch (e) {alert('ERR UPDATING CANVAS\n' + e);}
}

function right_click(press) {
    let x = (press.offsetX / canvas.clientWidth) * 2 - 1;
    let y = ((canvas.clientHeight - press.offsetY) / canvas.clientHeight) * 2 - 1;
    press.preventDefault(); // prevent right-click context menu from popping up
    points.splice(0, points.length); // clear points from mouse click

    pt_count = 0;
    try {update_canvas(wgl_ctx, points, attr_pos, pt_count, attr_color, color_array);} catch (e) {alert('ERR UPDATING CANVAS\n' + e);}
}

function color_click() {
    update_style([picker_input, picker_lbl], 'none', 'inline-block');
}

function get_color() {
    color_hex = picker_input.value;
    picker_btn.style.backgroundColor = color_hex;
    canvas.style.border = '7px solid ' + color_hex;
    let vec4 = make_vec4_color();
    if (is_bright(vec4)) {
        picker_btn.style.color = '#151414';
    } else {
        picker_btn.style.color = '#d9d9d9';
    }
    color_array = vec4;
    update_canvas(wgl_ctx, points, attr_pos, pt_count, attr_color, vec4);
    update_style([picker_input, picker_lbl], 'inline-block', 'none');
}

