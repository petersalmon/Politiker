const express = require("express");
const router = express.Router();
const markerList = require("../models/maps");
const List = require("../models/lists");
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
    req.flash('error', 'You do not have permission to do that.');
    res.redirect('/Politiker/maps');
}

// Get the maps page

router.get("/", isLoggedIn, function(req,res){
    res.render("maps", {flashMsg: req.flash('error')});
});

// Update the array of selected voters else create a new array; uses AJAX
router.post("/", isLoggedIn, function(req,res){
    markerList.update({}, req.body, {upsert:true}, function(err, newMarkerList){        
        if(err){
            console.log(err);
            res.status(200).json({ error: 'failed' });
        }
        else{
            // console.log(req.body);
            res.status(200).json({ message: 'success' });
        } 
    });
});

// Fetch data from MySQL databse table based on selected voters from map
router.get('/lists/new', isLoggedIn, isViewer, function(req, res, next) {
    markerList.findOne().exec(function(err, foundMarkerList){
        if(err){
            console.log(err);
        }
        else{
            var idList = foundMarkerList.markerIds;
            let uniqueIdList = [...new Set(idList)].toString(); 

            // console.log(uniqueIdList);

            var whereClause = " WHERE id IN " + "(" + uniqueIdList + ")";

            var sql="SELECT * FROM voters" + whereClause;
            mysqlConnection.query(sql, function (err, data, fields) {
                if(err){
                    console.log(err);
                }
                else{
                    res.render('maps-lists-new', {userData:data, idList:uniqueIdList});
                }
            });
        }
    });
});

module.exports = router;
