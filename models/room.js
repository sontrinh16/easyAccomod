const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);

const roomSchema = new Schema({
    price: {type: String, required: true},
    type: {type: String, required: true},
    area: {type: Number, required: true},
    floorIn: {type: Number},
    services: {
        withOwner: {type: String, default: null},
        bathroom: {type: String, default: null},
        heater: {type: String, default: null},
        kitchen: {type: String, default: null},
        aircond: {type: String, default: null},
        velanda: {type: String, default: null},
        elecPrice: {type: String, default: null},
        other: {type: String, default: null}
    },
    status: {type: String,  enum: ['available', 'rented','owner'], default: 'available'}
})

const roomModel = mongoose.model('Room', roomSchema);

module.exports = roomModel;