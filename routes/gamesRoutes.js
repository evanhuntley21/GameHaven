const express = require('express');
const controller = require('../controllers/gamesController');
const {isLoggedIn, validateGame, validateResult, isValidGameId, isSeller, setPath, } = require('../middleware/userAuthenticationAndValidation');
const multer = require('multer');
const offerRoutes = require("../routes/offerRoutes");
const router = express.Router();

//Setting up image upload
const storage = multer.diskStorage({ destination: 'public/images', filename:function (req, file, cb){
    cb(null, file.originalname);
}
});
const upload = multer({storage: storage});



//GET main items page
router.get('/', controller.index);



//GET form to create new game
router.get('/new', isLoggedIn, controller.new);

//POST Add new game to store
router.post('/', isLoggedIn, upload.single("image"), setPath, validateGame, validateResult, controller.createNew);

//GET specific games given search query
router.get('/search', controller.findGames);

//GET form to edit game
router.get('/:id/edit', isValidGameId, isLoggedIn, isSeller, controller.editGame);

//PUT update certain game by id
router.put("/:id", isValidGameId, isLoggedIn, isSeller, controller.updateGame);

//GET specific game given id
router.get('/:id', isValidGameId, controller.display);



//DELETE specific game given id
router.delete('/:id', isValidGameId, isLoggedIn, isSeller, controller.removeGame);



//Route to nested router
router.use("/:id/offers", offerRoutes);






module.exports = router;