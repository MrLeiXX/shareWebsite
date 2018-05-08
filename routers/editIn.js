var shareContent = require("../models/mongoose.js");
var safeDiscuss = require("./safe.js");

module.exports = function(req, res){
    var userName = "";

    //同时判断session和token

    //---csrf（随机数）攻击检测---xss攻击检测---
    var token = req.body.token;
    if(req.session.user && req.session.user.tokenVal == token){

        userName = req.session.user.uname;
        var title = req.body.title;
        var content = req.body.content;

        safeDiscuss({xssTest: title + content}, req);
        
        var str = {
            title: title,
            author: userName,
            createTime: new Date().toLocaleString(),
            content: content
        };
        shareContent.update({name: userName}, {$push: {discuss: str}},function(err, docs){
            if(err){
                res.send("{errCode: 502, errText: \"server is fail\"}");
            }
            else{
                res.redirect('/list');
            }
        });
    }
    else{
        var warnMessage = safeDiscuss({csrfTest: 1}, req);
        delete req.session.user;
        res.render('../views/alert',{name: "", type: 8, uname: "", warnData: warnMessage});
    }
}

// 对输入内容进行转义防止xss攻击
// function xssHtml(str){
//     var s = "";
//     s = str.replace(/&/g, "&amp;");
//     s = s.replace(/</g,"&lt;");
//     s = s.replace(/>/g,"&gt;");
//     s = s.replace(/ /g,"&nbsp;");
//     s = s.replace(/\'/g,"&#39;");
//     s = s.replace(/\"/g,"&quot;");
//     return s; 
// }