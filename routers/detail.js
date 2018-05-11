var shareContent = require("../models/mongoose.js");
var safeDiscuss = require("./safe.js");

module.exports = function(req, res){
    var userName = "";
    var pageId = req.params.pageId;

    if(req.session.user){
        userName = req.session.user.uname;
    }

    //---sql攻击检测---
    var warnMessage = safeDiscuss({nosqlTest: pageId}, req);

    if (!warnMessage){
        shareContent.find({"discuss._id": pageId}, {"discuss.$": 1, _id: 0}, function(err, docs){
            if(err){
                res.send("{errCode: 404, errText: \"the quest query not found\"}");
            }
            else{
                var Title = (docs[0].discuss)[0].title;
                var Author = (docs[0].discuss)[0].author;
                var Time = (docs[0].discuss)[0].createTime.toLocaleString();
                var Content = (docs[0].discuss)[0].content;
                res.render('../views/detail', {title: Title, author: Author, time: Time, content: Content, uname: userName});    
            }
        });
    }
    else {
        delete req.session.user;
        res.render('../views/alert',{name: "", type: 8, uname: "", warnData: warnMessage});
    }

    
}