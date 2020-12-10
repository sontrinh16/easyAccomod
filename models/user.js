const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {type: String, unique: true, required: true, trim: true},
    password: {type: String, required: true, trim: true, minlength: 6},
    password_confirm: {type: String, required: true, trim: true, minlength: 6},
    firstName: {type: String, required: true, trim: true},
    lastName: {type: String, trim: true},
    role: {type: String, enum: ['admin', 'renter','owner']},
    birthDay: {type: Date, default: null},
    phoneNumber: {type: String, required: true},
    socialID: {type: String, required: true},
    address: {
        city: {type: String, required: true},
        district: String,
        ward: String,
        road: String
    },
    authenticated: {type: Boolean, default: false},
    favoriteRoom: [{type: Schema.Types.ObjectId, ref: 'Post',default: false}]
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;