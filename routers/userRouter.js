const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router({ mergeParams: true});

router.post('/register', userController.register);

router.post('/login', userController.login);

router.get('/:id', userController.getUser);

router.get('/:id/authenticate-owner',userController.restrictedTo('admin') , userController.authenticateOwner);

//router.post('/reset-pass', userController.resetPass);

//router.get('/favoriteRooms', userController.getFavoriteRooms);

module.exports = router;