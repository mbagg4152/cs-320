// Slightly modified version of the original webgl-utils. Most changes are relating to formatting.

WebGLUtils = function () {
    let makeFailHTML = function (msg) {
        return '' +
               '<div style="width:500px;z-index:10000;margin: 20em auto auto;text-align:center;">' + msg +
               '</div>' + '<table style="background-color: #8CE; width: 100%; height: 100%;"><tr>' +
               '<td>' + '<div style="display: table-cell; vertical-align: middle;">' +
               '<div style="">' + msg + '</div>' + '</div>' + '</td></tr></table>';
    };

    let GET_A_WEBGL_BROWSER = 'WebGL browser err<br/>' + '<a href="http://get.webgl.org">Upgrade</a>';
    let OTHER_PROBLEM = 'WebGL computer err<br/>' + '<a href="http://get.webgl.org">Info</a>';

    let setupWebGL = function (canvas, opt_attribs, opt_onError) {
        function handleCreationError(msg) {
            let container = document.getElementsByTagName("body")[0];
            if (container) {
                let str = window.WebGLRenderingContext ? OTHER_PROBLEM : GET_A_WEBGL_BROWSER;
                if (msg) str += "<br/><br/>Status: " + msg;
                container.innerHTML = makeFailHTML(str);
            }
        }

        opt_onError = opt_onError || handleCreationError;

        if (canvas.addEventListener) {
            canvas.addEventListener("webglcontextcreationerror", function (event) {
                opt_onError(event.statusMessage);
            }, false);
        }
        let context = create3DContext(canvas, opt_attribs);
        if (!context) {
            if (!window.WebGLRenderingContext) opt_onError("");
            else opt_onError("");
        }
        return context;
    };

    let create3DContext = function (canvas, opt_attribs) {
        let names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
        let context = null;
        for (let ii = 0; ii < names.length; ++ii) {
            try { context = canvas.getContext(names[ii], opt_attribs);} catch (e) {}
            if (context) break;
        }
        return context;
    }

    return { create3DContext: create3DContext, setupWebGL: setupWebGL };
}();

if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
               window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
               function (callback, element) { window.setTimeout(callback, 1000 / 60); };
    })();
}

if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = (window.cancelRequestAnimationFrame || window.webkitCancelAnimationFrame ||
                                   window.webkitCancelRequestAnimationFrame || window.mozCancelAnimationFrame ||
                                   window.mozCancelRequestAnimationFrame || window.msCancelAnimationFrame ||
                                   window.msCancelRequestAnimationFrame || window.oCancelAnimationFrame ||
                                   window.oCancelRequestAnimationFrame || window.clearTimeout);
}