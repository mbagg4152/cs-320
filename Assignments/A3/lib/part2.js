let can1 = elem('canvas1'), can2 = elem('canvas2'), can3 = elem('canvas3'), can4 = elem('canvas4'), shift_x = 0.0,
    shift_y = 0.0, shift_z = 0.0;
let attr_pos, gl1, gl2, gl3, gl4, pts_circle, pts_ellipse, uni_color, uni_height, uni_res, uni_trans, uni_width,
    v_count;

function main() {
    pts_circle = make_round_points(CIRCLE, 0, 0);
    pts_ellipse = make_round_points(ELLIPSE, 0.8, 0.55);
    config_draw(gl1, ELLIPSE, can1, v4_dk_red, SRC_VERT, FRAG_RAD_2, RADIAL, pts_ellipse, 2, uni_trans, v_count);
    config_draw(gl2, TRIANGLE, can2, v4_black, SRC_VERT, FRAG_GRAD_2, GRADIENT, alt_tri, 2, uni_trans, v_count);
    config_draw(gl3, CIRCLE, can3, v4_dk_red, SRC_VERT, FRAG_RAD_3, RADIAL, pts_circle, 2, uni_trans, v_count);
    config_draw(gl4, SQUARE, can4, v4_red, SRC_VERT, FRAG_BASIC, BASIC, alt_sq0, 2, uni_trans, v_count);
}
