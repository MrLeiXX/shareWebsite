var shareContent = require("../models/mongoose.js");

module.exports = function(req, res){

    var userName = "";
    if(req.session.user){
        userName = req.session.user.uname;

        //生成随机token并放置与session中

        var tokenValue = Math.random().toString(36).substr(2);
        req.session.user.tokenVal = tokenValue;

        shareContent.find({name: userName}, {discuss: 1, _id: 0}, function(err, docs){
            if(err){
                res.send("{errCode: 502, errText: \"server is fail\"}");
            }
            else{
                //按照时间顺序进行排序
                var allContent = docs[0].discuss;
                var arr1 = allContent.sort(function(a,b){
                    return b.createTime - a.createTime;
                });
                var arr2 = arr1.map(function(item){
                    return {
                        _id: item._id,
                        title: item.title,
                        author: item.author,
                        createTime: item.createTime.toLocaleString(),
                        content: item.content
                    }
                });
                res.render('../views/list', {shareData: arr2, uname: userName, tokenVal: tokenValue});
            }
        });
    }
    else{
        res.redirect('/sign/land');
    }
}