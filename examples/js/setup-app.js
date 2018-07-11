
var width = 1200;
var height = 640;
var app = this.app = new PIXI.Application(width, height,
    {
        backgroundColor: 0x222222,
        resolution: 1,
        autoResize: true
    });
document.getElementById('canvas').appendChild(app.view);

var resize = function () {
    var w = window.innerWidth - 20;
    var ratio = width / height;

    var h2 = w / ratio;
    var scale = h2 / height;
    app.stage.scale.set(scale);
    app.renderer.resize(w, h2);
};
window.addEventListener('resize', resize);
resize();