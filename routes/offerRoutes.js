const express = require('express');
const router = express.Router({mergeParams: true});
const {isValidGameId, isLoggedIn, isSeller, isNotSeller, isNotLoggedIn, validateOffer, validateResult} = require('../middleware/userAuthenticationAndValidation');
const controller = require('../controllers/offersController');


//GET offers for item of specific id
router.get('/', isValidGameId, isLoggedIn, isSeller, controller.viewOffers);

//POST offer for item of specific id
router.post('/', isValidGameId, isLoggedIn, isNotSeller, validateOffer, validateResult, controller.makeOffer);


//PUT offer of specific id set status to 'accepted'
router.put('/:offerid', isValidGameId, isLoggedIn, isSeller, controller.acceptOffer);


module.exports = router;