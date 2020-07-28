const express = require("express");
const router = express.Router();
const User = require("../models/users");
const passport = require("passport");
const passportLocal = require("passport-local");
const crypto = require("crypto");
const nodemailer = require('nodemailer');
const cookieParser = require("cookie-parser")
const flash = require("express-flash");
const async = require("async");
const bcrypt = require("bcrypt");

passport.use(new passportLocal(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Getting the register page 

router.get("/register",function(req,res){
    res.render("register", {flashMsg: ''});
});

// Submitting the registration form 

router.post("/register",function(req,res){
    var newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        emailToken: crypto.randomBytes(64).toString('hex'),
        isVerified: false
    });
    User.register(newUser, req.body.password, async function(err, user){
        if(err){
            console.log(err);
            if(err.name === 'UserExistsError'){
                req.flash('error', 'A user with the given email is already registered');
            }
            else{
                req.flash('error', err.message);
            }
            return res.render("register", {flashMsg: req.flash('error'), flashType: 'danger' });
        }
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL_USER, // this should be YOUR GMAIL account
                pass: process.env.GMAIL_PASS // this should be your password
            }
        });
        var mail = {
            from: 'noreply@politiker.com', 
            to: user.username, 
            subject: 'Politiker - Verify your email',
            text: `
                Hello, thanks for registering with Politiker!
                Please click on the link below below to verify your account.
                http://${req.headers.host}/Politiker/verify-email?token=${user.emailToken}
            `,
            html: `
                <h1>Hello,</h1>
                <p>thanks for registering with Politiker!</p>
                <p>Please click on the link below to verify your account.</p>
                <a href="http://${req.headers.host}/Politiker/verify-email?token=${user.emailToken}">Verify your account</a>
            `
        }
        try{
            await transporter.sendMail(mail);
            req.flash('success', 'Thank you for registering. Please check your email to verify your account')
            res.render('login', {flashMsg: req.flash('success'), flashType: 'success' });
        } catch(error){
            console.log(error);
            req.flash('error', 'Something went wrong during your registration. Please contact us at ' + process.env.GMAIL_USER);
            res.render('register', {flashMsg: req.flash('error'), flashType: 'danger' });
        }
    });
});

// Email verification route

router.get("/verify-email", async function(req,res,next){
    try{
        var user = await User.findOne({emailToken: req.query.token});
        if(!user){
            req.flash('error', 'Token is invalid. Please contact us for assistance.')
            res.render('login', {flashMsg: req.flash('error'), flashType: 'danger' });
        }
        user.emailToken = null;
        user.isVerified = true;
        await user.save();
        await req.login(user, async function(err){
            if(err) return next(err);
            res.redirect('/Politiker/home');
        });
    } catch(error){
        console.log(error);
        req.flash('error', 'Something went wrong. Please contact us at ' + process.env.GMAIL_USER);
        res.render('login', {flashMsg: req.flash('error'), flashType: 'danger' });
    }
});

// Getting the login page 

router.get("/login",function(req,res){
    res.render("login", {flashMsg: ''});
});

// Function to check if user is verified

async function verifiedCheck(req, res, next){
    try{
        var user = await User.findOne({username: req.body.username});
        if(!user){
            req.flash("error", 'No account associated with that email was found.');
            res.render('login', {flashMsg: req.flash('error'), flashType: 'danger'});
        }
        else{
            if(user.isVerified){
                return next();
            }
            req.flash('error', 'Your account has not been verified. Please check your email to verify your account');
            return res.render('login', {flashMsg: req.flash('error'), flashType: 'danger' });
        }
    }
    catch(error){
        console.log(error);
        req.flash('error', 'Something went wrong. Please contact us at ' + process.env.GMAIL_USER);
        return res.render('login', {flashMsg: req.flash('error'), flashType: 'danger' });
    }
}

// Submitting the login form 

// router.post("/login", verifiedCheck, passport.authenticate("local", {
//     successRedirect: "/Politiker/home",
//     failureRedirect: "/Politiker/login",
//     failureFlash: true
// }), 
// function(req,res){
// });

router.post('/login', verifiedCheck, function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if(err){
            return next(err); // will generate a 500 error
        }
        // Generate a JSON response reflecting authentication status
        if(!user){
            req.flash("error", 'Invalid email or password. Please try again.');
            return res.render('login', {flashMsg: req.flash('error'), flashType: 'danger'});
        }
        req.login(user, loginErr => {
            if (loginErr) {
                console.log(loginErr)
                req.flash("error", 'Invalid email or password. Please try again.');
                return res.render('login', {flashMsg: req.flash('error'), flashType: 'danger'});
            }
            return res.redirect('/Politiker/home');
        });      
    })(req, res, next);
});

// Logout

router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/Politiker/login");
});

// Function to check if user is logged in

function isLoggedIn(req, res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/Politiker/login");
}

// Page to reset password if forgotten

router.get("/password-reset",function(req,res){
    res.render("forgot-password", {flashMsg: ''});
});

// Send user a rest semail password with a link to follow

router.post("/password-reset",function(req,res,next){
    async.waterfall([
        function(done){
            crypto.randomBytes(20, function(err, buf){
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done){
            User.findOne({username: req.body.email}, function(err, user){
                if(!user){
                    req.flash('error', 'No account with that email address was found');
                    return res.render('forgot-password', {flashMsg: req.flash('error'), flashType: 'danger' });
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // rest link expires in 1 hour

                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done){
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.GMAIL_USER, // this should be YOUR GMAIL account
                    pass: process.env.GMAIL_PASS // this should be your password
                }
            });
            var mail = {
                from: 'noreply@politiker.com', 
                to: user.username, 
                subject: 'Politiker - Password Reset',
                text: `
                    You are recieveing this email because a request was recieved to rest the account associated with this email address 
                    Please click on the link below below to reset your password.
                    http://${req.headers.host}/Politiker/password-reset/${token}
                    If you did not request a password reset, ignore this email and your password will remain unchanged.
                `,
                html: `
                    <h1>Hello,</h1>
                    <p>You are recieveing this email because a request was recieved to rest the account associated with this email address.</p>
                    <p>Please click on the link below to reset your password.</p>
                    <a href="http://${req.headers.host}/Politiker/password-reset/${token}">Reset your account</a>
                    <p>If you did not request a password reset, ignore this email and your password will remain unchanged.</p>
                `
            }
            transporter.sendMail(mail, function(err){
                console.log('email sent');
                req.flash('success', 'An email has been sent to ' + user.username + ' with further insrutions');
                done(err, 'done');
            });
        }
    ],
    function(err){
        if(err) return next(err);
        res.render('login', {flashMsg: req.flash('success'), flashType: 'success' });
    });
});

// Render a page for the user to rest password

router.get('/password-reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.render('login', {flashMsg: req.flash('error'), flashType: 'danger'});
      }
      res.render('reset-password', {flashMsg: '', token: req.params.token});
    });
  });

// Update the password once the user submits the form

router.post('/password-reset/:token', function(req, res) {
    async.waterfall([
        function(done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.render('login', {flashMsg: req.flash('error'), flashType: 'danger'});
                }
                if(req.body.password === req.body.confirm) {
                    user.setPassword(req.body.password, function(err) {

                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save(function(err) {
                            req.logIn(user, function(err) {
                                done(err, user);
                            });
                        });
                    })
                } 
                else {
                    req.flash("error", "Passwords do not match.");
                    return res.render('reset-password'), {flashMsg: req.flash('error'), flashType: 'danger'};
                }
            });
        },
        function(user, done){
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.GMAIL_USER, // this should be YOUR GMAIL account
                    pass: process.env.GMAIL_PASS // this should be your password
                }
            });
            var mail = {
                from: 'noreply@politiker.com', 
                to: user.username, 
                subject: 'Politiker - Your password has been changed',
                text: `
                    You are recieveing this email because the password has change for the account associated with this email address.
                    If you did not request a password reset, please reach out to us at politiker.test@gmail.com.
                `,
                html: `
                    <h1>Hello,</h1>
                    <p>You are recieveing this email because the password has change for the account associated with this email address.</p>
                    <p>If you did not request a password reset, please reach out to us at politiker.test@gmail.com.</p>
                `
            }
            transporter.sendMail(mail, function(err){
                req.flash('success', 'Success! Your password has been changed.');
                done(err);
            });
        }
    ], function(err) {
        res.render('login', {flashMsg: req.flash('success'), flashType: 'success'});
    });
});  

module.exports = router;