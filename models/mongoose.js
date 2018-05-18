
var mongoose = require('mongoose');
var DB_URL = 'mongodb://localhost:27017/newdiscuss';
mongoose.connect(DB_URL);

var Schema = mongoose.Schema;

var shareSchema = new Schema({
    name: String,
    passWord: String,
    discuss: [{
        title: String,
        author: String,
        createTime: Date,
        content: String
    }]
});

var Discuss = mongoose.model('Discuss', shareSchema);

module.exports = Discuss;