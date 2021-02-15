// Maggie Horton Winter 2021
function code_lines(lines) { return lines.join('\n'); } // join code lines by \n, more readable
const vShaderCode = code_lines([
    'attribute vec4 vShaderPoints;',
    'void main(){',
    '   gl_Position = vShaderPoints;',
    '   gl_PointSize = 10.0;',
    ' }']);
const fShaderCode = code_lines([
    'precision mediump float;',
    'uniform vec4 fragColor;',
    'void main() {',
    '   gl_FragColor = fragColor;',
    '}']);

function main() {

}

