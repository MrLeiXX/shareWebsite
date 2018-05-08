var safeLog = require("../models/mongooseSafe");

module.exports = function(req, res){

    if(req.session && req.session.user){
        if(req.session.user.uname == "lei12345"){
            safeLog.find(function(err,docs){
                if(err){
                    res.send("{errCode: 502, errText: \"server is fail\"}");
                }
                else{
                    res.render('../views/safelog',{safedata: docs, uname: req.session.user.uname});
                }
            });
        }
        else{
            res.render('../views/alert',{name: "", type: 9, uname: req.session.user.uname});
        }
    }
    else{
        res.render('../views/alert',{name: "", type: 9, uname: ""});
    }
}