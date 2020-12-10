const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);

const roomSchema = new Schema({
    price: {type: String, required: true},
    area: {type: Number, required: true},
    floorIn: {type: Number},
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    status: {type: String,  enum: ['available', 'rented','owner']}
})

const roomModel = mongoose.model('Room', roomSchema);

module.exports = roomModel;