const model = require("../models/offers");
const games = require("../models/games");

exports.viewOffers = (req, res, next) => {
    let id = req.params.id;
    Promise.all([model.find({gameListing: id}).populate("buyer", "firstName lastName"), games.findById(id)])
    .then(offersandGames =>{
            if(offersandGames[0])
            {
                [offers, game] = offersandGames;
                res.render("./offers/offers", {offers, game});
            }
    })
    .catch(err=>next(err));
}

exports.makeOffer = (req, res, next) =>{
    let offer = new model(req.body);
    offer.buyer = req.session.user;
    offer.gameListing = req.params.id;
    console.log(offer);
    offer.save()
    .then((offer) =>{
        Promise.all([games.findOneAndUpdate({_id: req.params.id}, {$max:{highestOffer: offer.amount}}), games.findOneAndUpdate({_id: req.params.id}, {$inc:{offers: 1}})])
        .then((games) => {
            if(games){
                req.flash('success', 'Offer added successfully');
                console.log(games[0]);
                res.redirect(`../${req.params.id}`);
            }
        })
        .catch(err=>next(err));
    })
    .catch(err=>next(err));
}

exports.acceptOffer = (req, res, next) =>{
    let offer = req.params.offerid;
    let game = req.params.id;
    Promise.all([model.findOneAndUpdate({_id: offer}, {status: "Accepted"}), model.updateMany({gameListing: game, status: "Pending"}, {status: "Rejected"}), games.findByIdAndUpdate({_id:game}, {active:false})])    
    .then(items =>{
        gameId = items[2];
        res.redirect(`/games/${game}/offers`)

    })
    .catch(err=>next(err));
}