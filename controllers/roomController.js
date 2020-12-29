const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const Room = require('./../models/room');
const Post = require('./../models/post');

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

exports.editRoom = catchAsync( async( req, res, next) => {
    let post = await Post.findOne({_id: req.params.id});
    console.log(req.body)
    if(post){
        let room = await Room.findByIdAndUpdate({_id : post.rooms[0]._id}, req.body);
        res.status(200).json({
            status: "success"
        })
    }
    else{
        return next ( new appError(404, 'Post not found'));
    }
})