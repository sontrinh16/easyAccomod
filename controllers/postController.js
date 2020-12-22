const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const Post = require('./../models/post');
const Room = require('./../models/room');
const User = require('../models/user');
const roomController = require('./../controllers/roomController');

exports.getPosts = catchAsync(async (req, res, next) => {
    const posts = await Post.find({}).populate('author').populate('rooms');
    res.status(200).json({
        status: "success",
        data: {
            posts
        }
    });
});

//exports.getPosts

exports.getPost = catchAsync(async (req, res, next) => {
    const post = await Post.findOne({_id: req.params.id}).populate('author').populate('rooms');

    res.status(200).json({
        status: "success",
        data: {
            post
        }
    });
});

exports.createPost = catchAsync(async (req, res, next) => {
    let post = new Post(req.body);
    post = await post.save();

    res.status(200).json({
        status: "success"
    });
   
});

exports.editPost = catchAsync(async (req, res, next) => {
    let post = await Post.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true
    });
    res.status(200).json({
        status: 'success'
    });
});

exports.addFavorite = catchAsync(async (req, res, next) => {
    req.user.favoriteRoom.push(req.params.id);
    let user = await User.findOneAndUpdate({ _id: req.user._id }, {favoriteRoom: req.user.favoriteRoom}, {
        new: true
    });
    res.status(200).json({
        status: 'success'
    });
});

// exports.reportRoom = catchAsync(async (req, res, next) => {
//     let post = await Post.findOne({_id: req.params.id});
//     post.reported.push(req.report._id);
//     console.log(post);
//     post = await post.save();
//     res.status(200).json({
//         status: 'success',
//         data: {
//             report: req.report
//         }
//     });
// });
