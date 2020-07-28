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

function isViewerCamps(req, res, next){
    if(req.user.userRole !== 'Viewer'){
        return next(); 
    }    
    Camp.find({}, function(err, camps){
        if(err){
            console.log(err);
        }
        else{
            req.flash("error", 'You do not have permission to do that.');
            res.render("campaigns", {flashMsg: req.flash('error'), camps: camps});
        }
    })
}

// getting the list of campaigns available

router.get("/", isLoggedIn, function(req,res){
    Camp.find({}, function(err, camps){
        if(err){
            console.log(err);
        }
        else{
            res.render("campaigns", {flashMsg: '', camps: camps});
        }
    })
});

// creating a new campaign to the list of campagins

router.post("/", isLoggedIn, isViewerCamps, function(req,res){
    Camp.create(req.body.camp, function(err, newCamp){
        if(err){
            console.log(err);
        }
        else{
            console.log(req.body.camp);
            res.redirect("/Politiker/campaigns")
        }
    });
});

// Function to check if user is a Viewer

function isViewerCampId(req, res, next){
    if(req.user.userRole !== 'Viewer'){
        return next();
    }

    var cmapType = req.url.substring(1).split("/")[0];
    var campId = req.url.substring(1).split("/")[1];
    var campUrl = cmapType + '/' + campId;

    console.log(req.url);
    console.log(campUrl);

    req.flash('message', 'You do not have permission to do that.');
    req.flash('type', 'danger');
    res.redirect('/Politiker/campaigns/' + campUrl);
}

// getting specific campaigns

router.get(['/phone-campaign/:id', 
            '/text-campaign/:id', 
            '/email-campaign/:id', 
            '/door-campaign/:id'], isLoggedIn,  function(req, res, next) {

    var campUrl = req.url.substring(1).split("/")[0];

    Script.find({}, function(err, scripts){          

        List.find({}, {title:1}, function(err, lists){

            var listTitles = lists.map(function(item) {
                return item['title'];
            });  

            // console.log(listTitles);

            Camp.findById(req.params.id).exec(function(err, foundCamp){            

                var listIds = foundCamp.listIds;
                var campType = foundCamp.type;
                
                if(listIds.length > 0){
                    var sql='SELECT * FROM voters WHERE ID IN ' + '(' + listIds + ')';
                }
                else{
                    var sql='SELECT * FROM voters WHERE 1 = 0';
                }

                mysqlConnection.query(sql, function (err, voterData, fields) {
                    if(err){
                        console.log(err);
                    }
                    else{
                        // console.log(phoneData);
                        if(campType === "phone"){
                            res.render('campaign-phone', {flashMsg: req.flash('message'), flashType: req.flash('type'), camp:foundCamp, campUrl:campUrl, listTitles:listTitles, voterData:voterData, scripts:scripts});
                        }
                        else if(campType === "text"){
                            res.render('campaign-text', {flashMsg: req.flash('message'), flashType: req.flash('type'), camp:foundCamp, campUrl:campUrl, listTitles:listTitles, voterData:voterData, scripts:scripts});
                        }
                        else if(campType === "email"){
                            res.render('campaign-email', {flashMsg: req.flash('message'), flashType: req.flash('type'), camp:foundCamp, campUrl:campUrl, listTitles:listTitles, voterData:voterData, scripts:scripts});       
                        }
                        else if(campType === "door"){
                            res.render('campaign-door', {flashMsg: req.flash('message'), flashType: req.flash('type'), camp:foundCamp, campUrl:campUrl, listTitles:listTitles, voterData:voterData, scripts:scripts});                        
                        }
                    }
                });
            });
        });
    });
});

// Save the list

router.put(['/phone-campaign/:id/import_voters', 
            '/text-campaign/:id/import_voters', 
            '/email-campaign/:id/import_voters', 
            '/door-campaign/:id/import_voters'], isLoggedIn, isViewerCampId, function(req, res, next) {

    var listList = Object.keys(req.body.lists).map(function(key) {
        return key;
    });  

    List.find({ title: { $in: listList } }, {idList:1}, function(err, idLists){

        var idListString = '';

        idLists.forEach(function(idList){
            if(idListString === ''){
                idListString = idList.idList;
            }
            else{
                idListString = idListString + ',' + idList.idList
            }
        });

        var finalIdList = idListString.split(",");
        finalIdList = [...new Set(finalIdList)].toString();

        Camp.findOneAndUpdate({_id: req.params.id}, {$set: {'listIds':finalIdList}}).exec(function(err, foundCamp){
            if(err){
                console.log(err);
                res.redirect("back");
            }
            else{
                console.log("success");
                // add popup that lets the user know they saved the list successfully
                res.redirect("back");
            }
        });
    });
});

// For saving edits to campaigns
router.put(['/phone-campaign/:id/save', 
            '/text-campaign/:id/save', 
            '/email-campaign/:id/save', 
            '/door-campaign/:id/save'], isLoggedIn, function(req, res, next) {
    
    if(req.user.userRole !== 'Viewer'){
        var highlight = req.body.colorData;
        var customCols = req.body.customColDict;
        var counts = req.body.statCounts;

        // console.log(highlight);
        // console.log(customCols);
        // console.log(counts[3]);
        
        Camp.findOneAndUpdate({_id: req.params.id}, {$set: {"highlight": highlight, 
                                                            "customCols": customCols,
                                                            "counts": counts}}).exec(function(err, foundCamp){
            if(err){
                console.log('FAILED');
                req.flash('message', 'Something went wrong. Please try again.')
                req.flash('type', 'danger')
                res.status(400).json({ message: 'Something went wrong. Failed to save.' });
            }
            else{
                console.log('SUCCEED');
                req.flash('message', 'Your list has been saved!')
                req.flash('type', 'success')
                res.status(200).json({ message: 'success' });
            }
        });
    }
    else {
        console.log('USER IS A VIEWER');
        req.flash('message', 'You do not have permission to do that.')
        req.flash('type', 'danger')
        res.status(403).json({ message: 'You do not have permission to do that.' });
    }
});

// deleting campaign
router.delete(['/phone-campaign/:id', 
               '/text-campaign/:id', 
               '/email-campaign/:id', 
               '/door-campaign/:id'], isLoggedIn, isViewerCampId, function(req, res, next) {

    Camp.findByIdAndRemove(req.params.id).exec(function(err, foundCamp){
        if(err){
            res.redirect("/Politiker/campaigns")
            console.log(err);
        }
        else{
            res.redirect("/Politiker/campaigns")
        }
    });
});

module.exports = router;