$(function () {
    var offset = 3;
    var fromX;
    var fromY;
    var canvas = document.getElementById("myCanvas");
    var drawFlag = false;
    var w = 1075;
    var h = 1079;
    var context = $("canvas").get(0).getContext('2d');
    var socket = io.connect('/');
    // Image オブジェクトを生成
    var img = new Image();
    img.src = './public/image/20220618044054_1.jpg';

    // 画像読み込み終了してから描画
    img.onload = function () {
        context.drawImage(img, 10, 10);
    }

    canvas.width = w;
    canvas.height = h;
    context.strokeStyle = "#000000";
    context.lineWidth = 3;
    context.lineJoin = "round";
    context.lineCap = "round";

 
    // サーバからメッセージ受信
    socket.on('first send', function (msg) {
        //console.log(msg);
        for (key in msg) {
            context.strokeStyle = msg[key].color;
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(msg[key].fx, msg[key].fy);
            context.lineTo(msg[key].tx, msg[key].ty);
            context.stroke();
            context.closePath();
        }
    });
    socket.on('send user', function (msg) {
        context.strokeStyle = msg.color;
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(msg.fx, msg.fy);
        context.lineTo(msg.tx, msg.ty);
        context.stroke();
        context.closePath();
    });
 
    socket.on('clear user', function () {
        context.clearRect(0, 0, $('canvas').width(), $('canvas').height());
    });
 
    $('canvas').mousedown(function (e) {
        drawFlag = true;
        fromX = e.pageX - $(this).offset().left - offset;
        fromY = e.pageY - $(this).offset().top - offset;
        return false;  // for chrome
    });
 
    $('canvas').mousemove(function (e) {
        if (drawFlag) {
            draw(e);
        }
    });
 
    $('canvas').on('mouseup', function () {
        drawFlag = false;
    });
 
    $('canvas').on('mouseleave', function () {
        drawFlag = false;
    });
 
    $('li').click(function () {
        context.strokeStyle = $(this).css('background-color');
    });
 
    $('#clear').click(function (e) {
        socket.emit('clear send');
        e.preventDefault();
        context.clearRect(0, 0, $('canvas').width(), $('canvas').height());
        var img = new Image();
        img.src = './public/image/20220618044054_1.jpg';
        img.onload = function () {
            context.drawImage(img, 10, 10);
        }
    });
 
    function draw(e) {
        var toX = e.pageX - $('canvas').offset().left - offset;
        var toY = e.pageY - $('canvas').offset().top - offset;
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(fromX, fromY);
        context.lineTo(toX, toY);
        context.stroke();
        context.closePath();
 
        // サーバへメッセージ送信
        socket.emit('server send', { fx: fromX, fy: fromY, tx: toX, ty: toY, color: context.strokeStyle });
        fromX = toX;
        fromY = toY;
    }
});