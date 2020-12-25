const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    title: {type: String, required: true, minlength: 4, maxlength: 150},
    content: {type: String, required: true, minlength: 4, maxlength: 2000},
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    created: {type: Date, default: Date.now}, 
    star: {type: Number, required: true, default: 5, min: 0},
    belongTo: {type: Schema.Types.ObjectId, ref: 'Post'},
    authenticate: {type:Boolean, default: false}
})

const reviewModel = mongoose.model('Review', reviewSchema);

module.exports = reviewModel;