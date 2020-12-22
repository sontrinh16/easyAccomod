const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    type: {type: String, required: true},
    detail: {type: String, required: true},
    createdTime: {type: Date, default: Date.now},
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    resolved: {type: Boolean, default: false},
    postReported: {type: Schema.Types.ObjectId, ref: 'Post'}
})

const reportModel = mongoose.model('Report', reportSchema);

module.exports = reportModel;