const express = require("express");
const router = express.Router();
const User = require("../models/users");
const mysqlConnection = require("../connections/mysql-connection");
const flash = require("express-flash");
const async = require("async");
const nodemailer = require('nodemailer');

// Function to check if user is logged in

function isLoggedIn(req, res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/Politiker/login");
}

// returning the user's account information

router.get("/", isLoggedIn, function(req,res){
    User.findOne({_id: req.user._id}).exec(function(err, user){
        if(req.user.userRole === 'Admin'){
            User.find({}, function(err, users){
                if(err){
                    console.log(err);
                }
                else{
                    res.render("account-admin", {flashMsg: req.flash('message'), flashType: req.flash('type'), user: user, users: users});
                }
            })
        }
        else{
            if(err){
                console.log(err);
            }
            else{
                res.render("account-nonadmin", {flashMsg: req.flash('message'), flashType: req.flash('type'), user: user});
            }
        }
    });
});

// update the account info

router.put("/update-info", isLoggedIn, function(req,res){

    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var username = req.body.username;

    var role = req.user.userRole;

    if(role === 'Admin'){
        var renderView = 'account-admin';
    }
    else{
        var renderView = 'account-nonadmin';
    }

    console.log(firstName);
    console.log(lastName);
    console.log(username);

    User.find({}, function(err, users){
        User.findOneAndUpdate({username: username}, {$set: {'firstName': firstName,
                                                            'lastName': lastName,
                                                            'username': username}}).exec(function(err, user){
            if(err){
                    console.log(err);
                    req.flash("message", 'Something went wrong. Please try again.');
                    req.flash("type", 'danger');
                    // res.render(renderView, {flashMsg: req.flash('error'), flashType: 'danger', user: user, users: users});
                    res.redirect("/Politiker/account");
                }
            else{
                    console.log("success");
                    req.flash("message", 'Your account info has been succesfully updated!');
                    req.flash("type", 'success');
                    // res.render(renderView, {flashMsg: req.flash('success'), flashType: 'success', user: user, users: users});     
                    res.redirect("/Politiker/account");  
                }
        });
    });
});

// update the password

router.put('/update-password', function(req, res) {

    // console.log(req.user.username);
    // console.log(req.body.oldPassword);
    // console.log(req.body.newPassword);
    // console.log(req.body.confirmPassword);

    var role = req.user.userRole;

    if(role === 'Admin'){
        var renderView = 'account-admin';
    }
    else{
        var renderView = 'account-nonadmin';
    }

    async.waterfall([
        function(done) {
            User.find({}, function(err, users){
                User.findOne({ username: req.user.username }, function(err, user) {
                    user.authenticate(req.body.oldPassword, function(err,model,passwordError){
                        if(passwordError){
                            console.log(err)
                            req.flash("message", 'Your old password is incorrect.');
                            req.flash("type", 'danger');
                            // res.render(renderView, {flashMsg: req.flash('message'), flashType: 'danger', user: user, users: users});
                            res.redirect('/Politiker/account');
                        }
                        else{
                            if(req.body.newPassword === req.body.confirmPassword) {
                                user.setPassword(req.body.newPassword, function(err) {
                                    user.save(function(err) {
                                        // if(err){
                                        //     console.log(err)
                                        //     req.flash("error", 'Something went wrong. Please try again.');
                                        //     res.render(renderView, {flashMsg: req.flash('error'), flashType: 'danger', user: user, users: users});
                                        // }
                                        done(err, user);
                                    });
                                });
                            } 
                            else {
                                req.flash("message", "Passwords do not match.");
                                req.flash("type", "danger");
                                // res.render(renderView, {flashMsg: req.flash('message'), flashType: 'danger', user: user, users: users});
                                res.redirect('/Politiker/account');
                            }
                        }
                    });
                });
            });
            console.log('First function complete');
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
                done(err, user);
            });
            console.log('Second function complete');
        }
    ], function(err) {
        User.find({}, function(err, users){
            User.findOne({ username: req.user.username }, function(err, user) {
                req.flash('message', 'Your password has been changed successfully!');
                req.flash('type', 'success');
                // res.render(renderView, {flashMsg: req.flash('message'), flashType: 'success', user: user, users: users});
                res.redirect('/Politiker/account');
                console.log('Third function complete');
            });
        });
    });
});

// update user roles

router.put("/update-role", isLoggedIn, function(req,res){

    var role = req.user.userRole;

    if(role === 'Admin'){
        var renderView = 'account-admin';

        var pairs = req.body;

        User.find({}, function(err, users){
            User.findOne({ username: req.user.username }, function(err, user) {

                Object.keys(pairs).forEach(function(key) {
                    User.findOneAndUpdate({username: key}, {$set: {'userRole': pairs[key]}}).exec(function(err){
                        if(err){
                            console.log(err);
                            req.flash("message", 'Something went wrong. Please try again.');
                            req.flash("type", 'danger');
                            // res.render(renderView, {flashMsg: req.flash('message'), flashType: 'error', user: user, users: users});
                            res.redirect('/Politiker/account');
                        }
                    });
                    console.log(key, pairs[key]);
                });
            });
        });

        User.find({}, function(err, users){
            User.findOne({ username: req.user.username }, function(err, user) {
                if(err){
                    console.log(err);
                    req.flash("message", 'Something went wrong. Please try again.');
                    req.flash("type", 'danger');
                    // res.render(renderView, {flashMsg: req.flash('message'), flashType: 'error', user: user, users: users});
                    res.redirect('/Politiker/account');
                }
                else{
                    console.log("success");
                    req.flash("message", 'The user roles have been succesfully updated!');
                    req.flash("type", 'success');
                    // res.render(renderView, {flashMsg: req.flash('message'), flashType: 'success', user: user, users: users});       
                    res.redirect('/Politiker/account');
                }
            });
        });
    }
    else{
        req.flash("message", 'You do not have permission to do that.');
        req.flash("type", 'danger');
        res.redirect('/Politiker/account');
    } 
});

// remove a user

router.delete('/remove-user/:id', isLoggedIn, function(req, res, next) {

    if(req.user.userRole === 'Admin'){

        var userId = req.body.userId;
        
        User.findByIdAndRemove(userId).exec(function(err, foundUser){
            if(err){
                console.log('FAILED');
                req.flash('message', 'Something went wrong. Please try again.')
                req.flash('type', 'danger')
                res.status(400).json({ message: 'Something went wrong. Failed to save.' });
            }
            else{
                console.log('SUCCEED');
                req.flash('message', 'User has been removed successfully!')
                req.flash('type', 'success')
                res.status(200).json({ message: 'success' });
            }
        });
    }
    else {
        req.flash('message', 'You do not have permission to do that.')
        req.flash('type', 'danger')
        res.status(403).json({ message: 'You do not have permission to do that.' });
    }
});

module.exports = router;