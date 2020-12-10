const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notiSchema = new Schema({
    postID: {type: Schema.Types.ObjectId, ref: 'Post'},
    created: {type: Date, default: Date.now},
    type:{type: String, enum:['review', 'post']},
});

const notitModel = mongoose.model('Notification', notiSchema);

module.exports = notiModel;