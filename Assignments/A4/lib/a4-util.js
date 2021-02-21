function init_buffers(gl, verts) {
    let vert_buff;
    try {
        vert_buff = gl.createBuffer();
    } catch (e) {
        clog('failed making vbuff');
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vert_buff);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    try { attr_pos = gl.getAttribLocation(gl.program, 'a_pos'); } catch (e) { clog('POS ERR\n' + e);}
    gl.vertexAttribPointer(attr_pos, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attr_pos);
    return verts.length/2;
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