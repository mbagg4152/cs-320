// Maggie Horton Winter 2021
// TODO - CHANGE VAR NAMES
// TODO - PROB DONT USE SNAKE CASE NAMES

/********************************************************
 * Shaders
 ********************************************************/

// TODO - just write these bad boys using regular string concatenation or smth im just a particular bitch and thought it was ugly
// TODO - also the shaders dont need to be in screaming snake case do w/e u want
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


// TODO - could have a separate let statement on each line. also could opt out of using global vars and modify functions to pass values
// TODO - also could change let to var i think?
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

// TODO - i dont think you need to have this bitch be called main. just whatever you change it to, make sure to update it in the html to have this launch on load
function main() {
    // document elements
    canvas = elem('main_canvas');
    picker_btn = elem('color_btn');
    picker_input = elem('color_picker');
    picker_lbl = elem('color_lbl');
    pt_count = 0;
    color_hex = '#1a7bd5'; // TODO - CHANGE COLOR VALUE
    picker_input.value = color_hex;
    picker_btn.style.backgroundColor = color_hex;
    init_webgl(); // TODO - should just initialize values here i just felt it was too cluttered. that or maybe combine w/ register_events

    try { color_array = make_vec4_color(); } catch (e) { alert(e); } // TODO - could be moved i think? just makes vec4 array from color

    register_events(); // TODO - can register here or just combine w/ init_webgl

    // clear everything
    wgl_ctx.clearColor(1.0, 1.0, 1.0, 1.0);
    wgl_ctx.clear(wgl_ctx.COLOR_BUFFER_BIT);

    // TODO - idk if this line needs to go here
    wgl_ctx.uniform4f(attr_color, color_array[0], color_array[1], color_array[2], color_array[3]);
}

function init_webgl() { // set up webgl context, shaders, etc. and make sure program is loaded
    // TODO - prob dont need try-catch
    try { wgl_ctx = getWebGLContext(canvas); } catch (e) { alert('ERR - WEBGL CONTEXT'); }
    try { initShaders(wgl_ctx, SRC_VERT, SRC_FRAG); } catch (e) { alert('ERR - SHADERS'); }
    try { attr_pos = wgl_ctx.getAttribLocation(wgl_ctx.program, 'a_pos'); } catch (e) { alert('ERR - POS'); }
    try { attr_color = wgl_ctx.getUniformLocation(wgl_ctx.program, 'l_color'); } catch (e) { alert('ERR - COLOR'); }
}

function register_events() { // register events for canvas, button and color picker
    canvas.onclick = function (event_left) { left_click(event_left); }
    canvas.oncontextmenu = function (event_right) { right_click(event_right); }
    // TODO - remove this if you dont add button
    picker_btn.onclick = function () { color_click(); }
    picker_input.onclick = function () { get_color(); }
    picker_input.onchange = function () { get_color(); }
}

function left_click(press) {
    pt_count += 1; // TODO - not needed, can use points.length/2 later when point count is needed

    // TODO - idk how to change this that much but pls try ur darndest
    // get coords based on canvas size & then convert to webgl coords
    let x = (press.offsetX / canvas.clientWidth) * 2 - 1;
    let y = ((canvas.clientHeight - press.offsetY) / canvas.clientHeight) * 2 - 1;

    // add mouse click points to point array
    points.push(x);
    points.push(y);
    // TODO - prob dont need try catch?
    try {update_canvas(wgl_ctx, points, attr_pos, pt_count, attr_color, color_array);} catch (e) {alert('ERR UPDATING CANVAS\n' + e);}
}

function right_click(press) {
    // TODO - get rid of x & y idk why i left them and submitted the code with these in here ugh
    let x = (press.offsetX / canvas.clientWidth) * 2 - 1;
    let y = ((canvas.clientHeight - press.offsetY) / canvas.clientHeight) * 2 - 1;
    // TODO - maybe can remove this? idk how itll affect it if popup still happens
    press.preventDefault(); // prevent right-click context menu from popping up
    points.splice(0, points.length); // clear points from mouse click

    // TODO - could also just reinforce that points.length is 0 idk
    pt_count = 0;

    // TODO - prob dont need try catch
    try {update_canvas(wgl_ctx, points, attr_pos, pt_count, attr_color, color_array);} catch (e) {alert('ERR UPDATING CANVAS\n' + e);}
}

function color_click() {
    update_style([picker_input, picker_lbl], 'none', 'inline-block');
}

function get_color() {
    color_hex = picker_input.value;
    picker_btn.style.backgroundColor = color_hex; // TODO - dont need
    canvas.style.border = '7px solid ' + color_hex; // TODO - dont need
    let vec4 = make_vec4_color();

    // TODO - extra bitch shit
    if (is_bright(vec4)) {
        picker_btn.style.color = '#151414';
    } else {
        picker_btn.style.color = '#d9d9d9';
    }
    color_array = vec4;
    update_canvas(wgl_ctx, points, attr_pos, pt_count, attr_color, vec4);
    update_style([picker_input, picker_lbl], 'inline-block', 'none'); // TODO - dont need
}

