const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const Report = require('./../models/report');

exports.createReport = catchAsync( async(req, res, next) => {
    if (req.body){
        let report = new Report(req.body);
        report.author = req.user._id
        report.postReported = req.params.id;
        report = await report.save();
        res.status(200).json({
            status: 'success',
            data: {
                report
            }
        });;
    }
    else {
        return next(new appError(400, 'please add a report details'));
    }
});

exports.getReports = catchAsync( async(req, res, next) => {
    let reports = await Report.find({}).populate('postReported').populate('author');
    res.status(200).json({
        status: "success",
        data: {
            reports
        }
    })
});
