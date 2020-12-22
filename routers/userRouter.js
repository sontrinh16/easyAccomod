const express = require('express');
const userController = require('../controllers/userController');
const adminRouter = require('../routers/adminRouter');

const router = express.Router({ mergeParams: true});

router.post('/register', userController.register);

router.post('/login', userController.login);

router.get('/:id', userController.getUser);

router.use('/admin', adminRouter);

//router.post('/reset-pass', userController.resetPass);

//router.get('/favoriteRooms', userController.getFavoriteRooms);

module.exports = router;