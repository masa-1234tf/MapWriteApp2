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
    canvas.width = w;
    canvas.height = h;
    context.strokeStyle = "#000000";
    context.lineWidth = 3;
    context.lineJoin = "round";
    context.lineCap = "round";

    // サーバからメッセージ受信
    socket.on('first send', function (msg) {
        for (key in msg) {
            context.strokeStyle = msg[key].color;
            context.lineWidth = 3;
            context.beginPath();
            context.moveTo(msg[key].fx, msg[key].fy);
            context.lineTo(msg[key].tx, msg[key].ty);
            context.stroke();
            context.closePath();
            console.log("first send")
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
        console.log("send user")
    });
    
    socket.on('login',function () {
    socket.emit('login',prompt('login'));
});

    socket.on('clear user', function () {
        context.clearRect(0, 0, $('canvas').width(), $('canvas').height());
        console.log("clear user")
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
        var rect = e.target.getBoundingClientRect()
        var x = e.clientX - rect.left
        var y = parseInt(e.clientY - rect.top,10)
        document.getElementById("PosXY").innerHTML = `"X="${x-10}:"Y="${y-1}`
        console.log(`${x}:${y}`)
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
        /*
        var img = new Image();
        img.src = './public/image/20220618044054_1.jpg';
        img.onload = function () {
            context.drawImage(img, 10, 10);
        }
         */
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