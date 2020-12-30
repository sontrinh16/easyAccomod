const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const Review = require('./../models/review');
const Notification = require('./../models/notification');

exports.getNotifications = catchAsync(async(req, res, next) => {
    let noti = await Notification.find({});
    let not_seen_noti = await Notification.find({seen: false});
    res.status(200).json({
        status: "success",
        data: {
            noti,
            not_seen_noti: not_seen_noti.length
        }
    })
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