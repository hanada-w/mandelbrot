enchant();

var game;

var rs = -2.0;
var re = 0.8;
var is = -1.5;
var ie = 1.5;
var tx, ty, tx2, ty2;
var imageData;
var H = 355;
var W = 320;

window.onload = function () {

    // enchant.js
    game = new Game(W, H);
    game.fps = 30;

    var sprite = new Sprite(W, H);
    var surface = new Surface(W, H);
    sprite.image = surface;

    var context = surface.context;
    imageData = context.createImageData(W, H);

    game.rootScene.addChild(sprite);

    game.rootScene.addEventListener(Event.ENTER_FRAME, function () {

        if (zooming) {
            // zoom
            var dx0 = re - rs;
            var dy0 = ie - is;
            var dx1 = dx0 * 0.99;
            var dy1 = dy0 * 0.99;
            rs += (dx0 - dx1) / 2;
            re = rs + dx1;
            is += (dy0 - dy1) / 2;
            ie = is + dy1;
        }

        // draw
        context.clearRect(0, 0, W, H);
        calc(rs, re, is, ie, imageData);
        context.putImageData(imageData, 0, 0);
    });

    var zooming = false;
    game.rootScene.addEventListener("touchstart", function (e) {
        tx = e.x;
        ty = e.y;
        tx2 = e.x;
        ty2 = e.y;

        zooming = true;

        //moveCenter(tx2, ty2);
    });

    game.rootScene.addEventListener("touchend", function (e) {
        zooming = false;
    });

    game.rootScene.addEventListener("touchmove", function (e) {
        // move
        var nx = (re - rs) * (tx - e.x) / W;
        var ny = (ie - is) * (ty - e.y) / H;
        rs += nx;
        re += nx;
        is += ny;
        ie += ny;
        tx = e.x;
        ty = e.y;
    });

    game.start();
}

function moveCenter(x, y) {
    var nx = (re - rs) * (x - W/2) / W;
    var ny = (ie - is) * (y - H/2) / H;
    rs += nx;
    re += nx;
    is += ny;
    ie += ny;
}

function calc(reStart, reEnd, imStart, imEnd, imageData) {

    var i, j, k;
    var n, nmax;
    var col;
    var x, y;
    var xn, yn;
    var a, b;

    nmax = 100;

    for (i = 0; i < W; i++) {
        for (j = 0; j < H; j++) {
            a = reStart + (reEnd - reStart) * i / W;
            b = imStart + (imEnd - imStart) * j / H;
            x = 0;
            y = 0;
            for (n = 1; n < nmax; n++) {
                col = 0;
                xn = x;
                yn = y;
                x = x * x - y * y + a;
                y = 2 * xn * yn + b;
                if ((x * x + y * y) > 4) {
                    col = n;
                    break;
                }
            }
            var color = getColor(col);
            var p = (i + (j * W)) * 4;
            imageData.data[p] = color[0];
            imageData.data[p + 1] = color[1];
            imageData.data[p + 2] = color[2];
            imageData.data[p + 3] = color[3];
        }
    }

}

function getColor(col) {
    var r0 = 10, g0 = 30, b0 = 70; // start
    var r1 = 255, g1 = 255, b1 = 255; // end
    if (col == 0)
        return [0, 0, 0, 255];

    return [
        ((r1 - r0) * col / 100) + r0,
        ((g1 - g0) * col / 100) + g0,
        ((b1 - b0) * col / 100) + b0,
        255
        ];
}
