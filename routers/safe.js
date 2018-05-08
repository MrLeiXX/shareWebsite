var safeDiscuss = require("../models/mongooseSafe");

module.exports = function(reqMessage, req){
    var a = 0, b = 0, c = 0, content = "";

    if(reqMessage.sqlTest){
        var cont = reqMessage.sqlTest;
        var re=/select|update|delete|truncate|join|union|exec|insert|drop|count|'|"|;|>|<|%/i;
        if(re.test(cont)){
            a = 1;
            content = "疑似SQL注入攻击：" + cont;
        }
    }

    if(reqMessage.xssTest){
        var cont = reqMessage.xssTest;
        var re=/<script>|<\/script>|<img>|<img\/>|on|<a|alert|confirm|prompt|console/ig;
        if(re.test(cont)){
            b = 1;
            content = "疑似xss攻击：" + cont;
        }
    }

    if(reqMessage.csrfTest){
        var cont = reqMessage.csrfTest;
        if(cont == 1){
            c = 1;
            content = "疑似CSRF攻击：无token";
        }
    }

    if(a || b || c){
        var str = {
            date: new Date().toLocaleString(),
            ip: req.headers["x-real-ip"],
            path: req.path,
            method: req.method,
            content: content, //注意：content可能包含xss攻击，需要ejs配合使用
            userAgent: req.headers["user-agent"]
        };

        var newData = new safeDiscuss(str);
        newData.save(function(err, docs){
            if(err){
                    console.log("the data saved is failed -----------" + err);
            }
        });
        return {warndate: str.date, warnip: str.ip, warnagent: str.userAgent};
    }
    else {
        return false;
    }
}