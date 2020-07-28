const express = require("express");
const router = express.Router();
const Camp = require("../models/campaigns");
const List = require("../models/lists");
const Script = require("../models/scripts");
const mysqlConnection = require("../connections/mysql-connection");

// Function to check if user is logged in

function isLoggedIn(req, res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/Politiker/login");
}

// Function to check if user is a Viewer

function isViewer(req, res, next){
    if(req.user.userRole !== 'Viewer'){
        return next();
    }
    var scriptType = req.url.split("/")[1];
    req.flash('error', 'You do not have permission to do that.');
    res.redirect('/Politiker/scripts/' + scriptType);
}

// getting the list of scripts available

router.get(["/phone", 
            "/text", 
            "/email", 
            "/door"], isLoggedIn, function(req,res){

    var scriptType = req.url.substring(1);
    
    Script.find({type: scriptType}, function(err, scripts){
        if(err){
            console.log(err);
        }
        else{
            res.render("scripts", {flashMsg: req.flash('error'), scripts: scripts, scriptType: scriptType});
        }
    })
});

// creating a new script to the list of scripts

router.post(["/phone", 
             "/text", 
             "/email", 
             "/door"], isLoggedIn, isViewer, function(req,res){

    var scriptType = req.url.substring(1);

    console.log(req.body.script);

    req.body.script.type = scriptType;

    console.log(req.body.script);

    Script.create(req.body.script, function(err, newScript){
        if(err){
            console.log(err);
        }
        else{
            console.log(req.body.script);
            res.redirect("back")
        }
    });
});

// update a script
router.put(["/phone/:id", 
            "/text/:id", 
            "/email/:id", 
            "/door/:id"],  isLoggedIn, isViewer, function(req, res, next) {
    Script.findOneAndUpdate({_id: req.params.id}, {$set: {'title':req.body.title, 
                                                          'creator':req.body.creator, 
                                                          'content':req.body.content}}).exec(function(err, foundScript){
        if(err){
            console.log(err);
            res.redirect("back");
        }
        else{
            // add popup that lets the user know they saved the list successfully
            res.redirect("back");
        }
    });
});

// Deleting a script
router.delete(["/phone/:id", 
               "/text/:id", 
               "/email/:id", 
               "/door/:id"],  isLoggedIn, isViewer, function(req, res, next) {
    Script.findByIdAndRemove(req.params.id).exec(function(err, foundScript){
        if(err){
            res.redirect("back")
            console.log(err);
        }
        else{
            res.redirect("back")
        }
    });
});

module.exports = router;