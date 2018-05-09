//验证码机制

var captchapng = require('captchapng');

module.exports = function(req, res){
    var captchaCode = parseInt(Math.random() * 9000 + 1000);

    //将验证码存储到session中
    req.session.captchaCode = {
        use: "first",
        val: captchaCode
    };

    var c = new captchapng(80, 30, captchaCode);
    c.color(0, 0, 0, 0);
    c.color(80, 80, 80, 255);

    var img = c.getBase64();
    var imgbase64 = new Buffer(img, 'base64');
    res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    res.end(imgbase64);
}