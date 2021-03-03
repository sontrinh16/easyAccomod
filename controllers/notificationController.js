const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const Review = require('./../models/review');
const Notification = require('./../models/notification');

exports.getNotifications = catchAsync(async(req, res, next) => {
    if (req.query.limit||req.query.page){
        const options = {
            page: req.query.page,
            limit: req.query.limit,
            sort: {created : -1},
            select: {
                _id: 0,
                __v: 0
            }
        };
        let docs = await Notification.paginate({}, options);
        let notifications = docs.docs;
        let not_seen_noti = await Notification.find({seen: false});
        res.status(200).json({
            status: "success",
            data: {
                notifications,
                not_seen_noti: not_seen_noti.length
            }
        });
    }
    else{
        let noti = await Notification.find({}).sort('-created').select({
            _id: 0,
            __v: 0
        });
        let not_seen_noti = await Notification.find({seen: false});
        res.status(200).json({
            status: "success",
            data: {
                noti,
                not_seen_noti: not_seen_noti.length
            }
        })
    }
});

exports.seenNotification = catchAsync(async(req, res, next) => {
    let noti = await Notification.findOneAndUpdate({_id: req.params.id}, {seen: true}, {new: true});
    let not_seen_noti = await Notification.find({seen: false});
    res.status(200).json({
        status: "success",
        data: {
            noti,
            not_seen_noti: not_seen_noti.length
        }
    });
})