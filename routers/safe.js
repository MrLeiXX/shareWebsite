var safeDiscuss = require("../models/mongooseSafe");

module.exports = function(reqMessage, req){
    var a = 0, b = 0, c = 0, content = "";

    //nosql攻击检测
    if(reqMessage.nosqlTest){
        var cont = reqMessage.nosqlTest;
        var re=/select|update|delete|truncate|join|union|exec|insert|drop|count|\$|\$eq|\$gt|\$gte|\$lt|\$lte|\$ne|\$in|\$nin|\$or|\$and|\$not|\$nor|\$exists|\$type|\$position|\$sort|\$each|\$push|\$pull|\$pop|\$set|\$re|\$inc|\$elem|\$where|\$mo|'|"|;|\{|\}|\(|\)/i;
        if(re.test(cont)){
            a = 1;
            content += ("疑似注入攻击  " + cont);
        }
    }

    //xss攻击检测
    if(reqMessage.xssTest){
        var cont = reqMessage.xssTest;
        var re=/<script>|<\/script>|<img>|<img\/>|on|<a|alert|confirm|prompt|console/ig;
        if(re.test(cont)){
            b = 1;
            content += ("疑似xss攻击  " + cont);
        }
    }

    //CSRF攻击检测
    if(reqMessage.csrfTest){
        var cont = reqMessage.csrfTest;
        if(cont == 1){
            c = 1;
            content += ("疑似CSRF攻击  无token");
        }
    }

    if(a || b || c){
        var str = {
            date: new Date().toLocaleString(),
            ip: req.headers["x-real-ip"],
            path: req.path,
            method: req.method,
            content: content,
            userAgent: req.headers["user-agent"]
        };

        var newData = new safeDiscuss(str);
        newData.save(function(err, docs){
            if(err){
                    console.log("the data saved is failed -----------" + err);
            }
        });
        return {warndate: str.date, warnip: str.ip, warnagent: str.userAgent, warncont: str.content};
    }
    else {
        return false;
    }
}