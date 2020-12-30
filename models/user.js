const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {type: String, unique: true, required: true, trim: true},
    password: {type: String, trim: true, minlength: 6},
    firstName: {type: String, required: true, trim: true},
    lastName: {type: String, trim: true},
    isFacebookAccount: {type: Boolean, default: false},
    role: {type: String, enum: ['admin', 'renter','owner'], default: 'renter'},
    birthDay: {type: Date, default: null},
    phoneNumber: {type: String, default: null},
    socialID: {type: String, default: null},
    address: {type: String, default: null},
    authenticated: {type: Boolean, default: false},
    favoriteRoom: [{type: Schema.Types.ObjectId, ref: 'Post', default: null}]
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;