// Maggie Horton - Graphics Assignment 4 Winter 2021


function update_canvas(gl, pos_loc, points, u_matrix, m_matrix) { // update canvas w/ points and transformation matrix
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    let res;
    try { res = init_vbuff(gl, points, pos_loc);} catch (e) { alert('FAILED TO SET POS'); }
    wgl_ctx.uniformMatrix4fv(u_matrix, false, m_matrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, res);
}

function vec4(color_hex) { // hex --> decimal --> vec4: #RRGGBB --> R,G,B --> (R/255),(G/255),(B/255)
    let color_copy = color_hex;
    color_copy = color_copy.replace('#', '');
    return [hex_vec4(color_copy, 0, 1), hex_vec4(color_copy, 2, 3), hex_vec4(color_copy, 4, 5), 1.0];
}

function hex_vec4(line, idx0, idx1) { // get hex for R, G or B based on index values then divide by 255
    return (parseInt([line.charAt(idx0), line.charAt(idx1)].join(''), 16)/255.0).toFixed(5);
}

function clog(text) { console.log(text); } // rename console.log

function elem(id) { return document.getElementById(id); } // rename document.getElementById