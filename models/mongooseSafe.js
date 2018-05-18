var mongoose = require('mongoose');
var DB_URL = 'mongodb://localhost:27017/newdiscuss';
mongoose.connect(DB_URL);

var Schema = mongoose.Schema;

var safeSchema = new Schema({
    date: String,
    ip: String,
    path: String,
    method: String,
    content: String,
    userAgent: String
});

var safeDiscuss = mongoose.model('safeDiscuss', safeSchema);

module.exports = safeDiscuss;