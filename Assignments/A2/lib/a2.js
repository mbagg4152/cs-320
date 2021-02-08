function elem(id) {return document.getElementById(id);}

// document elements
let canvas = elem('main_canvas'),
    head_xy = elem('head_xy'),
    head_left = elem('head_left'),
    head_right = elem('head_right');

let context = canvas.getContext('2d');
let clk_x, clk_y, cnt_right = 0, cnt_left = 0;

canvas.addEventListener('click',
    function (event_left) {
        clk_x = event_left.clientX;
        clk_y = event_left.clientY;
        head_xy.innerText = '(' + clk_x + ',' + clk_y + ')';
        cnt_left += 1;
        head_left.innerText = 'left click count: ' + cnt_left;
    }, false);

canvas.addEventListener('contextmenu',
    function (event_right) {
        event_right.preventDefault();
        cnt_left = 0;
        head_left.innerText = 'left click count: ' + cnt_left;
        cnt_right += 1;
        head_right.innerText = 'right click count: ' + cnt_right;
    }, false);