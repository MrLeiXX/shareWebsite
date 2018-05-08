module.exports = function(req, res){
    var userName = "";
    var type = req.params.type;

    //生成随机数
    //引入use属性：防止网页在未刷新就再次请求的情况下token重复使用
    var tokenValue = Math.random().toString(36).substr(2);
    req.session.tokenVal1 = {
        use: "first",
        val: tokenValue
    };

    if(type == "land" || type == "register"){
        if(!req.session.user){
            res.render('../views/sign', {signType: type, uname: userName, tokenVal: tokenValue});
        }
        else{
            res.redirect('/');
        }
    }
    else{
        res.redirect('/');
    }
}