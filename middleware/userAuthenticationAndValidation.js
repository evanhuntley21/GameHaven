const model = require('../models/games');
const {validationResult, body} = require("express-validator")
exports.isLoggedIn = (req, res, next) => {
    if(req.session.user){
        return next();
    }
    else{
        req.flash('error', 'You need to log in first');
        return res.redirect('/users/login');
    }    
}

exports.setPath = (req, res, next) =>{
    if(req.file){
        req.body.image = req.file.originalname;
    }
    next();
}
exports.isSeller = (req, res, next) =>{
    let id = req.params.id;
    model.findById(id)
    .then(game =>{
        if(game){
        if(game.seller == req.session.user){
            return next();
        }
        else{
            let err = new Error("Unauthorized to access the resource");
            err.status = 401;
            return next(err);
        }
    } else {
        let err = new Error('Cannot find a game with id ' + id);
        err.status = 404;
        next(err);
    }
    })
    .catch(err=>next(err))
    };

exports.isNotSeller = (req, res, next) =>{
    let id = req.params.id;
    model.findById(id)
    .then(game =>{
        if(game){
        if(game.seller != req.session.user){
            return next();
        }
        else{
            let err = new Error("Unauthorized to access the resource");
            err.status = 401;
            return next(err);
        }
    } else {
        let err = new Error('Cannot find a game with id ' + id);
        err.status = 404;
        next(err);
    }
    })
    .catch(err=>next(err))
    };

exports.isNotLoggedIn = (req, res, next) =>{
    if(!req.session.user){
        return next();
    }
    else{
        req.flash('error', 'You are logged in already');
        return res.redirect('/users/profile');
    }
};


exports.isValidGameId = (req, res, next) =>{
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid game id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
}




exports.validateGame = [    
body('title',"Title cannot be empty").notEmpty().trim().escape(),
body('details', "Details cannot be empty").notEmpty().trim().escape(),
body('condition', "Condition must be selected from given options").isIn(["Slightly Used", "Like New", "Moderately Used", "Heavily Used", "Needs Repair"]),
body('price',).isInt({min: 1}),
body('image', "File cannot be empty").notEmpty()]



exports.validateUser = [    
body('firstName', "First name cannot be empty").notEmpty().trim().escape(),
body('lastName', "Last name cannot be empty").notEmpty().trim().escape(),
body('email', "Your email must be valid email address").isEmail().trim().escape().normalizeEmail(),
body('password', "Password must be at between 8 and 64 characters").isLength({min: 8, max: 64}).trim()]

exports.validateLogin = [
body('email', "Your email must be valid email address").isEmail().trim().escape().normalizeEmail(),
body('password', "Password must be at between 8 and characters").isLength({min: 8, max: 64}).trim()]

exports.validateOffer = [body('amount',).isInt({min: 1})]


exports.validateResult = (req, res, next) =>{
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array();
        errors.array().forEach(error =>{
            req.flash('error', error.msg)
        });
        return res.redirect('back');


    }
    else{
        return next();
    }
}