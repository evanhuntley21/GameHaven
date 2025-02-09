const model = require("../models/games");
const offers = require("../models/offers");

exports.index = (req, res, next) => {
    model.find().sort({price: 1})
    .then(games =>{
        res.render("./games/items", {games})
    })
    .catch(err =>{
        next(err);
    })
}
exports.display = (req, res, next) => {
    let id = req.params.id;
    model.findById(id).populate('seller', 'firstName lastName')
    .then(game =>{
        if(game){
            res.render("./games/item", {game});
        }
        else{
            let myError = new Error(`Game with id ${req.params.id} could not be found`);  
            myError.status = 404;
            next(myError);
        }
    })
    .catch(err=>next(err));

}

exports.createNew = (req, res, next) =>{

    
    let game = new model(req.body);
    game.seller = req.session.user
    game.save()
    .then((game) => {
        req.flash('success', 'Listing created successfully');
        res.redirect("/games");
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            req.flash('error', err.message);  
            return res.redirect('back');
        }
        next(err);
    });
}

exports.new = (req, res) => {
    res.render("./games/new");
}

exports.editGame = (req, res, next) =>{
    let id = req.params.id;
    model.findById(id)
    .then(game =>{
        if(game){
            res.render("./games/edit", {game});
        }
        else{
            let myError = new Error(`Game with id ${req.params.id} could not be found`);  
            myError.status = 404;
            next(myError);
        }
    })
    .catch(err=>next(err));

}

exports.updateGame = (req, res, next) =>{
    let game = req.body;
    let id = req.params.id;

    model.findByIdAndUpdate(id, game, {useFindAndModify: false, runValidators: true})
    .then(game =>{
        if(game){
            req.flash('success', 'Listing successfully updated');
            res.redirect("/games/" + id);
        }
        else{
            let myError = new Error(`Game with id ${req.params.id} could not be found`);
            myError.status = 404;
            next(myError);
        }
    })
    .catch(err => {
        if(err.name === 'ValidationError'){
            req.flash('error', err.message);  
            return res.redirect('back');
        }
        next(err);
    });

}

exports.removeGame = (req, res, next) =>{
    let id = req.params.id;
    Promise.all([model.findByIdAndDelete(id, {useFindAndModify: false}), offers.deleteMany({gameListing: id})])
    .then(modifications =>{
        if(modifications){
            const [game, numDeleted] = modifications;
            req.flash('success', 'Listing successfully deleted.');
            res.redirect("/games");
        }
        else{
            let myError = new Error(`Game with id ${req.params.id} could not be found`);
            myError.status = 404;
            next(myError);
        }
    })
    .catch(err => next(err));

}

exports.findGames = (req, res) =>{
    let searchWord = req.query.search;
    model.find({$or: [{details: {$regex: searchWord, $options: 'i'}}, {title: {$regex: searchWord, $options: 'i'}}]}).sort({price: 1})
    .then(games =>{
        if(games){
            res.render("./games/items", {games});
        }
        else{
            res.render("./games/noitems.ejs");
        }
    })
    .catch(err => next(err));
}

