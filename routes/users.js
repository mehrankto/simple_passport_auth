const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/Users');

//Login
router.get('/login', (req,res) => res.render("login"));
//Register
router.get('/register', (req,res) => res.render("register"));


//Register handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    //check required feilds
    if(!name || !email || !password || !password2) {
        errors.push({ msg: 'fill required feilds'});
    }

    //check pass match
    if( password !== password2 ) {
        errors.push({ msg: 'passwords do not match'});
    }

    //check pass lenght
    if(password.length < 6) {
        errors.push({ msg: 'password should be at least 6 characters' });
    }

    if ( errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {    //validation passes
        User.findOne({ email: email })
        .then( user => {
            if (user) {
                errors.push({ msg: 'email is already registered'});
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password,
                });

                //hashing
                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;

                        newUser.password = hash;
                        //save user
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'you are now registered and can log in');
                                res.redirect('/users/login')
                            })
                            .catch(err => console.log(err));
                }));
            }
        });
    }
});

//login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//logout handle
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'logged out');
    res.redirect('/users/login');
})

module.exports = router;