// Maggie Horton - Graphics Assignment 5 Winter 2021
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
