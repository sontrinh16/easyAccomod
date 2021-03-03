const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const User = require('./../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');
const axios =  require('axios');

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
        console.log(user)
        user.password = hash;
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

exports.loginFacebook = catchAsync( async (req, res, next) => {
    /*
    *   TO DO: AXIOS CALL FACEBOOK
    */
    const { user_id, access_token } = req.body
    const facebookData = await axios.get(`https://graph.facebook.com/v8.0/${user_id}?access_token=${access_token}&fields=id,name,email`)

    const userData = {
        email: facebookData.data.email,
        firstName: facebookData.data.name.split(' ')[0],
        lastName: facebookData.data.name.split(' ')[1],
        isFacebookAccount: true
    }

    console.log(userData)

    const findUser = await User.findOne({email: userData.email});
    if ( findUser !== null ){
        if (findUser.isFacebookAccount) {
            const user = findUser
            const token = generateToken(user._id);

            return res.status(200).json({
                status: "success",
                data: {
                    user,
                    token
                }
            })
        } else {
            return next(new appError(400, 'Email has been used'));
        }
    }
    else{
        let user = new User(userData);

        // default for renter
        // no need to manually authenticate
        user.authenticated = true;
        user = await user.save();    

        const token = generateToken(user._id);

        return res.status(200).json({
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
        if (match === true) {
            const token = generateToken(user._id);
            res.status(200).json({
                status: 'success',
                data: {
                    token,
                    user
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
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
        const decoded = await util.promisify(jwt.verify)(
            req.headers.authorization.split(' ')[1],
            process.env.JWT_SECRET
        );

        const user = await User.findOne({_id: decoded.id});
        if (!user) {
            return next(404, 'User not found');
        }
        else{
            req.user = user;
            return next();
        }
    }
    else {
        return next(new appError(401, 'Please login first'));
    }
});

exports.getUser = catchAsync( async(req, res, next) => {
    let user = await User.findOne({_id: req.params.id}).populate('favoriteRoom').select({
        password: 0,
        __v:0,
        
        
    });;
    if(user){
        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        })
    }
    else{
        return next( new appError(404, 'User not found'));
    }
});

exports.getAllOwner = catchAsync(async(req, res, next) => {
    if (req.query.limit||req.query.page){
        const options = {
            page: req.query.page,
            limit: req.query.limit,
            populate: ['favoriteRoom'],
            sort: {firstName : 1},
            select: {
                password: 0,
                __v:0,
                
                
            }
        };
        let docs = await User.paginate({}, options);
        let users = docs.docs
        res.status(200).json({
            status: "success",
            data: {
                users
            }
        });
    }
    else{
        let users = await User.find({}).populate('favoriteRoom').sort('firstName').select({
            
            password: 0,
            __v:0,
            
            
        });
        res.status(200).json({
            status: 'success',
            data: {
                users
            }
        });
    }
});


//admin authenticate owner function
exports.authenticateOwner = catchAsync(async(req, res, next) => {
    let user = await User.findOneAndUpdate({_id: req.params.id}, {authenticated: true}, {
        new: true
    });
    res.status(200).json({
        status: 'success'
    });
});

//user role restriction
exports.restrictedTo = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new appError(403, 'You do not have permission to perform this action')
        );
      }
  
      next();
    };
  };
