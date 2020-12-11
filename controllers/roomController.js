const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const Room = require('./../models/room');

exports.createRoom = catchAsync( async(req, res, next) => {
    let room = new Room(req.body);
    room =  await room.save();
    
})