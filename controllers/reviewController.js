const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const Review = require('./../models/review');

exports.createReview = catchAsync( async(req, res, next) => {
    if (req.body){
        let review = new Review(req.body);
        review.belongTo = req.params.id;
        review = await review.save();
        req.review = review;
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
    let reviews = await Review.find({});
    res.status(200).json({
        status: "success",
        data: {
            reviews
        }
    })
});

exports.authenticateReview = catchAsync( async(req, res, next) => {
    let review = await Review.findOneAndUpdate({_id : req.params.id}, {authenticate: true}, {new: true});
    res.status(200).json({
        status: 'success',
    });
});