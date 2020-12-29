const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notiSchema = new Schema({
    ID: {type: String},
    created: {type: Date, default: Date.now},
    type:{type: String, enum:['review', 'post']},
    seen:{type: Boolean, default: false}
});

const notitModel = mongoose.model('Notification', notiSchema);

module.exports = notiModel;