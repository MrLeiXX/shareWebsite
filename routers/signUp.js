var shareContent = require("../models/mongoose.js");
var crypto = require("crypto");
var safeDiscuss = require("./safe.js");

module.exports = function(req, res){

    if(!req.session.user){

        //---sql攻击检测---xss攻击---csrf（随机数）攻击检测---

        //判断验证码
        var capCode = req.body.capCode;

        if(req.session.captchaCode.val == capCode && req.session.captchaCode.use == "first"){
            req.session.captchaCode.use == "second";
            
            //判断token
            var token = req.body.token;
            if(req.session.tokenVal1.use == "first" && req.session.tokenVal1.val == token){
                req.session.tokenVal1.use = "second";

                //对用户名进行web安全验证，防止查询时受到攻击
                var uname = req.body.userName;
                var pwd = req.body.passWord;
                var warnMessage = safeDiscuss({nosqlTest: uname+pwd, xssTest: uname}, req);
            
                if(req.body.passWord.length != 32 || uname.length > 10 || uname.length < 6 || warnMessage){
                    res.render('../views/alert',{name: "", type: 8, uname: "", warnData: warnMessage});
                };
                shareContent.find({name: uname}, 'passWord', function(err, docs){
                    if(err){
                        res.send("{errCode: 502, errText: \"server is fail\"}");
                    }
                    if(docs.length < 1){
            
                        //在数据存入数据库前再次进行加密
                        pwd = crypto.createHash('md5').update(pwd).digest('hex');
            
                        var newData = new shareContent({name: uname, passWord: pwd});
                        newData.save(function(err, docs){
                            if(err){
                                console.log(err);
                            }
                        });
                        req.session.user = {
                            uname: uname,
                            pwd: pwd,
                        };
                        delete req.session.tokenVal1;
                        delete req.session.captchaCode;
                        res.render('../views/alert',{name: uname, type: 1, uname: uname});
                    }
                    else {
                        res.render('../views/alert',{name: "", type: 2, uname: ""});
                    }
                });   
            }
            else {
                var warnMessage = safeDiscuss({csrfTest: 1}, req);
                res.redirect('/sign/register');
            }
        }
        else{
            res.redirect('/sign/register');
        }  
    }
    else{
        res.redirect('/');
    }
}