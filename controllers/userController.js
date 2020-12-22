const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const User = require('./../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');

//Create json web token 
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRED_IN
    });
}

//user register
exports.register = catchAsync( async (req, res, next) => {
    let findUser = await User.findOne({email: req.body.email});
    if ( findUser !== null ){
        return next(new appError(400, 'Email has been used'));
    }
    else{
        const hash = await bcrypt.hash(req.body.password, 10);
        let user = new User(req.body);
        user.password = hash;
        user.password_confirm = hash;
        if (user.role === 'renter') {
            user.authenticated = true;
        }
        user = await user.save();
        const token = generateToken(user._id);

        const cookieOptions = {
            expires: new Date(
                Date.now() + 24 * 60 *60 *1000
            ),
            httpOnly: true,
            sameSite: 'None',
            secure: true
        }
        
        res.cookie('jwt', token, cookieOptions);

        res.status(200).json({
            status: "success",
            data: {
                user,
                token
            }
        })
    }
});

//user login
exports.login = catchAsync( async(req, res, next) => {
    const user = await User.findOne({email: req.body.email});
    if (user === null){
        return next(400, 'Email or Password are incorrect');
    }
    else {
        const match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
            const token = generateToken(user._id);

            const cookieOptions = {
                expires: new Date(
                    Date.now() + 24 * 60 *60 *1000
                ),
                httpOnly: true,
                sameSite: 'None',
                secure: true
            }
        
            res.cookie('jwt', token, cookieOptions);
            res.status(200).json({
                status: 'success',
                data: {
                    token
                }
            });
        }
        else {
            return next(new appError(400, 'Email or Password are incorrect'));
        }
    }
});

//check if user is login in
exports.isLogin = catchAsync( async(req, res, next) => {
    if (req.headers.token){
        const decoded = await util.promisify(jwt.verify)(
            req.headers.token,
            process.env.JWT_SECRET
        );

        const user = await User.findOne({_id: decoded.id});
        if (user === null) {
            return next(401, 'Please login first');
        }
        req.user = user;
        return next();
    }
    return next(401, 'Please login first');
});

exports.restrictedTo = (role) => {
    if (req.user.role === role){
        next();
    }
    else return next(new appError(401,'user are not authorized'));
}

