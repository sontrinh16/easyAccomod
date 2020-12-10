const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router({ mergeParams: true});

router.post('/register', userController.register);

router.post('/login', userController.login);

router.get('/logout', userController.logout);

//router.post('/reset-pass', userController.resetPass);

//router.get('/favoriteRooms', userController.getFavoriteRooms);

module.exports = router;