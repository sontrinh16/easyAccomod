const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    createdAt: {type: Date, default: Date.now},
    expiredAt: {type: Date, required: false}, 
    rooms: [{type: Schema.Types.ObjectId, ref: 'Room'}],
    type: {type: String, required: false},
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
    postPrice: {type: String, default: null},
    status: {type: String, enum: ['active', 'inactive'], default: 'active'},
    //reported: [{type: Schema.Types.ObjectId, ref: 'Report', default: null}],
    images: [{
        link: String
    }]
})

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;