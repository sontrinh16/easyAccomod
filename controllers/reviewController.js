const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const Review = require('./../models/review');
const Notification =  require('./../models/notification');

exports.createReview = catchAsync( async(req, res, next) => {
    if (req.body){
        let review = new Review(req.body);
        review.belongTo = req.params.id;
        review.author = req.user._id;
        review = await review.save();
        req.review = review;

        let noti = new Notification({
            ID: review._id,
            type: 'review'
        });

        noti = await noti.save();
        
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
                _id: 0,
                authenticate: 0,
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
            _id: 0,
            authenticate: 0,
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
    let review = await Review.findOneAndUpdate({_id : req.params.id}, {authenticate: true}, {new: true});
    res.status(200).json({
        status: 'success',
    });
});