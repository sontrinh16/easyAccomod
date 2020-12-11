const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {type: String, required: true, minlength: 4, maxlength: 150},
    content: {type: String, required: true, minlength: 4, maxlength: 20000},
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    createdAt: {type: Date, default: Date.now},
    expiredAt: {type: Date}, 
    //rooms: [{type: Schema.Types.ObjectId, ref: 'Room'}],
    address: {
        city: {type: String, required: true},
        district: {type: String, required: true},
        ward: {type: String, required: true},
        road: {type: String, required: true},
        addressDetail: String
    },
    authenticate: {type: Boolean, default: false},
    like: {type: Number, default: 0},
    saved: {type: Number, default: 0},
    reported: {type: Boolean, default: false}
})

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;