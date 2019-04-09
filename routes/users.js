const express = require('express');
const router = express.Router();

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
        })
    } else {    //validation passes
        res.send('pass')
    }
});

module.exports = router;