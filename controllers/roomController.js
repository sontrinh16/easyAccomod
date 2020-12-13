const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const Room = require('./../models/room');

exports.createRoom = catchAsync( async(req, res, next) => {
    //console.log(req.body.rooms);
    let roomIDs = [];
    if (req.body.rooms.length != 0){
        for (room of req.body.rooms){
            let newRoom = new Room(room);
            newRoom =  await newRoom.save();
            roomIDs.push(newRoom._id);
        }
        delete req.body.rooms;
        req.body.rooms = roomIDs;
        next()
    }
    else {
        return next(new appError(400, 'please add a room details'));
    }
});

exports.updateRoom = catchAsync( async( req, res, next) => {

})