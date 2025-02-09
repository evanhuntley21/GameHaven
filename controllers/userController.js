const model = require('../models/user');
const Game = require('../models/games');
const offer = require('../models/offers');

exports.signup = (req, res) =>{
    return res.render('./user/new');
};
exports.viewUserLogin = (req, res, next) => {
    res.render('./user/login');   
};
exports.createUser = (req, res, next) =>{
    let user = new model(req.body);
    user.save()
    .then(user=> {
        req.flash('success', 'You have successfully created an account. Please login');
        res.redirect('/users/login')
    })
    .catch(err=>{   
        if(err.code === 11000) {
            req.flash('error', 'Email has been used already, please enter a different one');  
            return res.redirect('/users/new');
        }
        if(err.name === 'ValidationError' ) {
            req.flash('error', err.message);  
            return res.redirect('back');
        }
        
        next(err);
    }); 
}

exports.login = (req, res, next) =>{
    let email = req.body.email;
    let password = req.body.password;
    model.findOne({email: email})
    .then(user =>{
        if(!user){
            req.flash('error', 'Email address is wrong');

            res.redirect('/users/login');
        }
        else{
            user.comparePass(password)
            .then(result =>{
                if(result){
                    req.session.user = user._id
                    req.flash('success', 'You have successfully logged in');
                    res.redirect('/users/profile');
                }
                else {
                    req.flash('error', 'Incorrect password, please try again');      
                    res.redirect('/users/login');
                }
            })
        }
    })
    .catch(err => next(err));
}

exports.viewProfile = (req, res, next) => {
    let id = req.session.user;
    Promise.all([model.findById(id), Game.find({seller: id}), offer.find({buyer: id}).populate("gameListing", "title")])
    .then(userGamesOffers =>{
        const [usr, games, offers] = userGamesOffers;
        res.render('./user/profile', {user: usr, games, offers})
    })
    .catch(err=>next(err));
}


exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) 
           return next(err);
       else
            res.redirect('/');  
    });
   
 };