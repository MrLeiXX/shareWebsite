var shareContent = require("../models/mongoose.js");

module.exports = function(req, res){
    
    var userName = "";
    if(req.session.user){
        userName = req.session.user.uname;
    }
    
    shareContent.find({}, 'discuss', function(err, docs){
        if(err){
            res.send("{errCode: 502, errText: \"server is fail\"}");
        }
        else{
            //按照时间顺序进行重新排序
            var arr = [];
            docs.forEach(function(items){
                items.discuss.forEach(function(item){
                    arr.push(item);
                });
            });
            var arr1 = arr.sort(function(a,b){
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
            res.render('../views/index', {shareData: arr2, uname: userName});
        }
    });
}