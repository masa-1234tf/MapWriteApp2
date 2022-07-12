$("#save").click(function () {
    canvas = document.getElementById('display');
    var base64 = canvas.toDataURL("image/jpeg");
    document.getElementById("save").href = base64;
});