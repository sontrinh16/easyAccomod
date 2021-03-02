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
    if (req.query.limit||req.query.page){
        const options = {
            page: req.query.page,
            limit: req.query.limit,
            populate: ['postReported','author'],
            sort: {createdTime : -1},
            select: {
                _id: 0,
                __v: 0
            }
        };
        let docs = await Report.paginate({}, options);
        let reports = docs.docs
        res.status(200).json({
            status: "success",
            data: {
                reports
            }
        });
    }
    else{
        let reports = await Report.find({}).populate('postReported').populate('author').sort('-createdTime').select({
            _id: 0,
            __v: 0
        });
        res.status(200).json({
            status: "success",
            data: {
                reports
            }
        })
    }
});
