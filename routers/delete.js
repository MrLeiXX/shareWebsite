var shareContent = require("../models/mongoose.js");
var safeDiscuss = require("./safe.js");

module.exports = function(req, res){

    var userName = "";
    var listId = req.query.listId;

    //同时判断session和token值

    //---sql攻击检测---csrf（随机数）攻击检测---
    var warnMessage = safeDiscuss({sqlTest: listId}, req);

    if (!warnMessage){

        var token = req.query.tokenId;
        if(req.session.user && req.session.user.tokenVal == token){
            
            userName = req.session.user.uname;

            shareContent.update({name: userName}, {$pull: {"discuss": {_id: listId}}},function(err, docs){
                if(err){
                    res.send("{errCode: 502, errText: \"server is fail\"}");
                }
                else{
                    res.redirect('/list');
                }
            });
        }  
        else{
            warnMessage = safeDiscuss({csrfTest: 1}, req);
            delete req.session.user;
            res.render('../views/alert',{name: "", type: 8, uname: "", warnData: warnMessage});
        }
    }
    else {
        delete req.session.user;
        res.render('../views/alert',{name: "", type: 8, uname: "", warnData: warnMessage});
    }
}