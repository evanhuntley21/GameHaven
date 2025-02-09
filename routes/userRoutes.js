const express = require('express');
const controller = require('../controllers/userController');
const {isNotLoggedIn, isLoggedIn, validateLogin, validateUser, validateResult} = require('../middleware/userAuthenticationAndValidation');
const router = express.Router();



router.get('/new', isNotLoggedIn, controller.signup);

router.post('/', isNotLoggedIn, validateUser, validateResult, controller.createUser);

router.get('/profile', isLoggedIn, controller.viewProfile);

router.get('/login', isNotLoggedIn, controller.viewUserLogin);

router.post('/login', isNotLoggedIn, validateLogin, validateResult, controller.login)

router.get('/logout', isLoggedIn, controller.logout);


module.exports = router;