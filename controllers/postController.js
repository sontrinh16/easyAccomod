const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const Post = require('./../models/post');
const Room = require('./../models/room');
const User = require('../models/user');
const Review = require('../models/review');
const Notification = require('../models/notification');
const roomController = require('./../controllers/roomController');
const getFilter = require('../utils/getFilter');
const pusher = require('./../utils/pusher');


exports.getPosts = catchAsync(async (req, res, next) => {
    if (req.query.limit||req.query.page){
        const options = {
            page: req.query.page,
            limit: req.query.limit,
            populate: ['author','rooms'],
            sort: {createdAt : -1},
            select: {
                
                
                __v: 0
            }
        };
        let docs = await Post.paginate({authenticate: true}, options);
        let posts = docs.docs
        res.status(200).json({
            status: "success",
            data: {
                posts
            }
        });
    }
    else {
        let posts = await Post.find({authenticate: true}).populate('author').populate('rooms').sort('-createdAt').select({
            
            
            __v: 0
        })
        res.status(200).json({
            status: "success",
            data: {
                posts
            }
        });
    }
    
});

exports.getAllPosts = catchAsync(async (req, res, next) => {
    if (req.query.limit||req.query.page){
        const options = {
            page: req.query.page,
            limit: req.query.limit,
            populate: ['author','rooms'],
            sort: {createdAt : -1},
            select: {
                
                
                __v: 0
            }
        };
        let docs = await Post.paginate({}, options);
        let posts = docs.docs
        res.status(200).json({
            status: "success",
            data: {
                posts
            }
        });
    }
    else {
        let posts = await Post.find({}).populate('author').populate('rooms').sort('-createdAt').select({
            
            
            __v: 0
        });
            res.status(200).json({
                status: "success",
                data: {
                    posts
                }
            });
    }
});

exports.getUserPost = catchAsync(async (req, res, next) => {
    if (req.query.limit||req.query.page){
        const options = {
            page: req.query.page,
            limit: req.query.limit,
            populate: ['author','rooms'],
            sort: {createdAt : -1},
            select: {
                
                
                __v: 0
            }
        };
        let docs = await Post.paginate({author: req.user._id}, options);
        let posts = docs.docs
        res.status(200).json({
            status: "success",
            data: {
                posts
            }
        });
    }
    else {
        let posts = await Post.find({author: req.user._id}).populate('author').populate('rooms').sort('-createdAt').select({
            
            
            __v: 0
        })
        res.status(200).json({
            status: "success",
            data: {
                posts
            }
        });
    }
});

exports.getPost = catchAsync(async (req, res, next) => {
    let post = await Post.findOne({_id: req.params.id}).populate('author').populate('rooms').sort('-createdAt').select({
        
        
        __v: 0
    });
    if (post !== null)
    {
        if (req.query.limit||req.query.page){
            const options = {
                page: req.query.page,
                limit: req.query.limit,
                populate: ['author'],
                sort: {created : -1},
                select: {
                    
                    
                    __v: 0
                }
            };
            let docs = await Review.paginate({belongTo: req.params.id, authenticate: true}, options);
            let reviews = docs.docs;
            res.status(200).json({
                status: "success",
                data: {
                    post,
                    reviews
                }
            });
        }
        else{
            let reviews = await Review.find({belongTo: req.params.id, authenticate: true}).populate('author').sort('-created').select({
                
                
                __v: 0
            });;
            res.status(200).json({
                status: "success",
                data: {
                    post,
                    reviews
                }
            });
        }
    }
    else {
        return next(new appError(404, 'Post not found!'));
    }
});

exports.createPost = catchAsync(async (req, res, next) => {
    let post = new Post(req.body);
    post.author = req.user._id;
    if( req.user.role === 'admin'){
        post.authenticate = true;
    }
    post = await post.save();

    let notification = new Notification({
        ID: post._id,
        type: 'post'
    });
    notification = await notification.save();
    let not_seen_noti = await Notification.find({seen: false});

    pusher.trigger('admin-notification', 'new-post', {
        data: {
            notification,
            not_seen_noti: not_seen_noti.length
        }
    });

    res.status(200).json({
        status: "success",
        data: {
            post
        }
    });
   
});

exports.searchPost = catchAsync(async (req, res, next) => {
    let postFilter = {};
    let roomFilter = {};
    let rangeFilter = {};
    if (req.body.address){
        for ( i in req.body.address){
            let queryName = `address.${i}`;
            postFilter[queryName]  = req.body.address[i];
        }
    }
    if (req.body.minPrice){
        rangeFilter.minPrice = req.body.minPrice;
    }
    if (req.body.maxPrice){
        rangeFilter.maxPrice = req.body.maxPrice;
    }
    if (req.body.type){
        postFilter.type = {$in: req.body.type};
    }
    if (req.body.minArea){
        rangeFilter.minArea = req.body.minArea; 
    }
    if (req.body.maxArea){
        rangeFilter.maxArea = req.body.maxArea;
    }
    if (req.body.services){
        roomFilter.services = req.body.services;
    }
    postFilter.authenticate = true;
    
    let posts = await Post.find(postFilter).populate('author').populate('rooms').sort('-createdAt').select({
        
        
        __v: 0
    });
    if (rangeFilter){
        if(rangeFilter.minPrice){
            posts = posts.filter(post => parseInt(post.rooms[0].price) >= parseInt(rangeFilter.minPrice));
        }
        if(rangeFilter.maxPrice){
            posts = posts.filter(post => parseInt(post.rooms[0].price) <= parseInt(rangeFilter.maxPrice))
        }
        if (rangeFilter.minArea){
            posts = posts.filter(post => post.rooms[0].area >= rangeFilter.minArea);
        }
        if (rangeFilter.maxArea){
            posts = posts.filter(post => post.rooms[0].area <= rangeFilter.maxArea);
        }
        if (roomFilter.services){
            posts = posts.filter(post => {
                return roomFilter.services.some(r => post.rooms[0].services.indexOf(r) >= 0);
            })
        }
    }
    res.status(200).json({
        status: 'success',
        data: {
            posts
        }
    });
});

exports.editPost = catchAsync(async (req, res, next) => {
    let post = await Post.findOne({_id: req.params.id});
    if(post){
    if ( post.authenticate === true){
        post = await Post.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true
        });
        res.status(200).json({
            status: 'success'
        }); 
    }
    else{
        return next(new appError(400, 'Cannot edit authenticated post'));
    }
}
else {
    return next( new appError(404, 'Post not found'));
}
});

exports.addFavorite = catchAsync(async (req, res, next) => {
    let post = await Post.findOne({ _id: req.params.id });
    let user = req.user;
    if (post){
        user.favoriteRoom.push(post._id);
        user = await user.save();
        post = await Post.findOneAndUpdate({_id: post._id}, {saved: post.saved + 1},{
            new: true
        });
    res.status(200).json({
        status: 'success'
    });
    }
    else {
        return next(new appError(404, 'Post not found'))
    }
});

exports.removeFavorite = catchAsync(async (req, res, next) => {
    let post = await Post.findOne({ _id: req.params.id });
    let user = req.user;
    if (post){
        if (user.favoriteRoom.includes(post._id)){
            user.favoriteRoom.splice(user.favoriteRoom.indexOf(post._id),1);
            user = await user.save();
            post = await Post.findOneAndUpdate({_id: post._id}, {saved: post.saved - 1},{
                new: true
            });
            res.status(200).json({
                status: 'success'
            });
        }
    return next(new appError(404, ' Post not found in user favorite list'));
    }
    else {
        return next(new appError(404, 'Post not found'))
    }
});

exports.prolongTimePost = catchAsync(async (req, res, next) => {
    let post = await Post.findOneAndUpdate({ _id: req.params.id }, {
        expiredAt: Date.parse(req.body.expiredAt),
        postPrice: req.body.postPrice
    });
    res.status(200).json({
        status: 'success'
    });
});

exports.toggleActivePost = catchAsync(async (req, res, next) => {
    let post = await Post.findOne({_id: req.params.id});
    if(post){
        if(post.status === 'active'){
            post = await Post.findByIdAndUpdate({_id: post._id},{status: 'inactive'}, {new:true})
        }
        else if (post.status === 'inactive') {
            post = await Post.findByIdAndUpdate({_id: post._id},{status: 'active'}, {new:true})
        }
        res.status(200).json({
            status: 'success'
        });
    }
    else{
        return next(new appError(404, 'Post not found'));
    }
});

exports.authenticatePost = catchAsync(async(req, res, next) => {
    let post = await Post.findOneAndUpdate({_id: req.params.id}, {authenticate: true}, {
        new: true
    });

    let notification = new Notification({
        ID: post._id,
        type: 'post'
    });
    notification = await notification.save();
    let not_seen_noti = await Notification.find({seen: false});

    pusher.trigger(`user-${post.author._id}`, 'post-authenticated', {
        data: {
            post,
            notification,
            not_seen_noti: not_seen_noti.length
        }
    });

    res.status(200).json({
        status: 'success'
    });
});