var shareContent = require("../models/mongoose.js");
var crypto = require("crypto");
var safeDiscuss = require("./safe.js");

module.exports = function(req, res){

    if(!req.session.user){

        //---sql攻击检测---xss攻击---csrf（随机数）攻击检测---

        //判断token
        var token = req.body.token;
        if(req.session.tokenVal1.use == "first" && req.session.tokenVal1.val == token){
            req.session.tokenVal1.use = "second";

            //对用户名进行web安全验证，防止查询时受到攻击
            var uname = req.body.userName;
            var warnMessage = safeDiscuss({sqlTest: uname, xssTest: uname}, req);

            //验证是否有流量劫持（跳过前端过滤机制）
            if(req.body.passWord.length != 32 || uname.length > 10 || uname.length < 6 || warnMessage){
                res.render('../views/alert',{name: "", type: 8, uname: "", warnData: warnMessage});
            }
    
            //在数据存入数据库前再次进行加密
            var pwd = crypto.createHash('md5').update(req.body.passWord).digest('hex');
        
            shareContent.find({name: uname}, 'passWord', function(err, docs){
                if(err){
                    res.send("{errCode: 502, errText: \"server is fail\"}");
                }
                if(docs.length < 1){
                    res.render('../views/alert',{name: "", type: 4, uname: ""});
                }
                else if( pwd == docs[0].passWord ){
                    req.session.user = {
                        uname: uname,
                        pwd: pwd,
                    };
                    delete req.session.tokenVal1;

                    if(uname == "lei12345"){
                        res.redirect('/safelog');
                    }
                    else{
                        res.render('../views/alert',{name: uname, type: 3, uname: uname});
                    }
                } else {
                    res.render('../views/alert',{name: uname, type: 5, uname: ""});
                }
            });   
        }
        else {
            var warnMessage = safeDiscuss({csrfTest: 1}, req);
            res.redirect('/sign/land');
        }

    }
    else{
        res.redirect('/');
    }
}