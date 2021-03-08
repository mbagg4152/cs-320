// Maggie Horton - Graphics Assignment 6 Winter 2021
function init_float_buff(gl, gl_var, arr_data) { // used for making color and position buffs
    let float_buff = gl.createBuffer(); // make new buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, float_buff); // bind buff
    gl.bufferData(gl.ARRAY_BUFFER, arr_data, gl.STATIC_DRAW); // populate buff with passed in data
    a_atrib = gl.getAttribLocation(gl.program, gl_var); // get attribute from shader
    gl.vertexAttribPointer(a_atrib, 3, gl.FLOAT, false, 0, 0); // make attribute pointer
    gl.enableVertexAttribArray(a_atrib); // enable attribute/float array
}

function vec3(color_hex) { // hex --> decimal --> vec4: #RRGGBB --> R,G,B --> (R/255),(G/255),(B/255)
    let color_copy = color_hex;
    color_copy = color_copy.replace('#', '');
    return [hex_vec3(color_copy, 0, 1), hex_vec3(color_copy, 2, 3), hex_vec3(color_copy, 4, 5)];
}

function hex_vec3(line, idx0, idx1) { // get hex for R, G or B based on index values then divide by 255
    return (parseInt([line.charAt(idx0), line.charAt(idx1)].join(''), 16)/255.0).toFixed(5);
}

function clog(text) { console.log(text); } // rename console.log

function elem(id) { return document.getElementById(id); } // rename document.getElementById
