const express = require("express");
const router = express.Router();
// const List = require("../models/lists");
const mysqlConnection = require("../connections/mysql-connection");

// Function to check if user is logged in

function isLoggedIn(req, res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/Politiker/login");
}

router.get("/", isLoggedIn, function(req,res){
    res.render("voter-profiles");
});

router.get("/search", isLoggedIn, function(req,res){

    var voterid = req.query.voterid;

    // Test if input is a intiger with digits as only characters in the string
    if(/^\d+$/.test(voterid)){

        var voter_info_sql = "SELECT * FROM voters WHERE id = " + voterid;
    
        mysqlConnection.query(voter_info_sql, function(err, voterData, fields) {
            if(err){
                console.log(err);
            }
            else{
                console.log(voterData);

                // CONTINUE BY USING VOTER INFO TO GET NEIGBORHOOD AND DONATION INFO

                var firstName = voterData[0].FirstName;
                var lastName = voterData[0].LastName;
                var streetName = voterData[0].StreetName;
                var city = voterData[0].City;
                var zipCode = voterData[0].ZipCode;


                var comm_info_sql = "SELECT * FROM community_demographics WHERE ????";
                var donation_info_sql = "SELECT * FROM voters WHERE ????;";


                res.render("voter-profiles-search", {voterData:voterData});
            }
        });
    
        // res.redirect("/");
    }
    else {
        console.log("THIS SUM BOLLSHIT!");
        res.redirect("/Politiker/voter-profiles")
    }
});

module.exports = router;
