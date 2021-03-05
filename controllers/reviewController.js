const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const Review = require('./../models/review');
const Notification =  require('./../models/notification');
const pusher = require('./../utils/pusher');

exports.createReview = catchAsync( async(req, res, next) => {
    if (req.body){
        let review = new Review(req.body);
        review.belongTo = req.params.id;
        review.author = req.user._id;
        review = await review.save();
        req.review = review;

        let notification = new Notification({
            ID: review._id,
            type: 'review'
        });

        notification = await notification.save();
        let not_seen_noti = await Notification.find({adminOnly: true, seen: false});

        pusher.trigger(`admin-notification`, 'new-review', {
            data: {
                notification,
                not_seen_noti: not_seen_noti.length
            }
        });
        
        res.status(200).json({
            status: 'success',
            data: {
                review
            }
        });
    }
    else {
        return next(new appError(400, 'please add a review details'));
    }
});

exports.getReviews = catchAsync( async(req, res, next) => {
    if (req.query.limit||req.query.page){
        const options = {
            page: req.query.page,
            limit: req.query.limit,
            populate: ['author','belongTo'],
            sort: {created : -1},
            select: {
                __v: 0
            }
        };
        let docs = await Review.paginate({}, options);
        let reviews = docs.docs
        res.status(200).json({
            status: "success",
            data: {
               reviews
            }
        });
    }
    else{
        let reviews = await Review.find({}).populate('belongTo').populate('author').sort('-created').select({
            
            __v: 0
        });
        res.status(200).json({
        status: "success",
        data: {
            reviews
        }
    })
    }
});

exports.authenticateReview = catchAsync( async(req, res, next) => {
    let review = await Review.findOne({_id : req.params.id}).populate('author');
    //console.log(review.author)
    if (review.authenticate !== true){
        await Review.updateOne({_id : req.params.id}, {authenticate: true});
        let notification = new Notification({
            ID: review._id,
            type: 'review',
            belongTo: review.author._id
        });
        notification = await notification.save();
        let not_seen_noti = await Notification.find({belongTo: review.author, seen: false});

        const channel =  `user-${review.author._id}`;

        //console.log(channel)

        pusher.trigger(channel, 'review-authenticated', {
            data: {
                review,
                notification,
                not_seen_noti: not_seen_noti.length
            }
        });

        res.status(200).json({
            status: 'success',
        });
    }
    else{
        return next(new appError(400, 'Already authenticated'))
    }
});