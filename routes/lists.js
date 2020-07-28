const express = require("express");
const router = express.Router();
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

function isViewerLists(req, res, next){
    if(req.user.userRole !== 'Viewer'){
        return next();
    }
    req.flash('error', 'You do not have permission to do that.');
    req.flash('type', 'danger');
    res.redirect('/Politiker/lists');
}

router.get("/", isLoggedIn, function(req,res){
    List.find({}, function(err, lists){
        if(err){
            console.log(err);
        }
        else{
            res.render("lists", {flashMsg: req.flash('error'), flashType: req.flash('type'), lists: lists});
        }
    })
});

// Fetch data from MySQL databse table
router.get('/new', isLoggedIn, isViewerLists, function(req, res, next) {
    var sql='SELECT * FROM voters';
    mysqlConnection.query(sql, function (err, data, fields) {
        if(err){
            console.log(err);
        }
        else{
            res.render('lists-new', {title:"voters", userData:data});
        }
    });
});

router.post("/", isLoggedIn, isViewerLists, function(req,res){
    List.create(req.body.list, function(err, newList){
        if(err){
            console.log(err);
        }
        else{
            console.log(req.body.list);
            res.redirect("/Politiker/lists")
        }
    });
});

function isViewerListId(req, res, next){
    if(req.user.userRole !== 'Viewer'){
        return next();
    }

    var urlSplit = req.url.split("/")[1];
    var listId = urlSplit.split("?")[0];

    req.flash('message', 'You do not have permission to do that.');
    req.flash('type', 'danger');
    res.redirect('/Politiker/lists/' + listId);
}

router.get('/:id', isLoggedIn, function(req, res, next) {
    console.log("REDIRECTED");
    List.findById(req.params.id).exec(function(err, foundList){
        if(err){
            console.log(err); 
        }
        else{
            var fields = foundList.fields
            var city = {"filterName":"City", "filterArray":foundList.filters.city}
            var zipCode = {"filterName":"ZipCode", "filterArray":foundList.filters.zipCode}
            var dob = {"filterName":"DOB", "filterArray":foundList.filters.dob}
            var gender = {"filterName":"Gender", "filterArray":foundList.filters.gender}
            var polAff = {"filterName":"PoliticalParty", "filterArray":foundList.filters.polAff}
            var voterType = {"filterName":"VoterType", "filterArray":foundList.filters.voterType}
            var yearLastVoted = {"filterName":"YearLastVoted", "filterArray":foundList.filters.yearLastVoted}
            var electDis = {"filterName":"ElectionDistrict", "filterArray":foundList.filters.electDis}
            var assemDis = {"filterName":"AssemblyDistrict", "filterArray":foundList.filters.assemDis}
            var congDis = {"filterName":"CongressDistrict", "filterArray":foundList.filters.congDis}
            var counDis = {"filterName":"CouncilDistrict", "filterArray":foundList.filters.counDis}
            var senDis = {"filterName":"SenateDistrict", "filterArray":foundList.filters.senDis}
            var civilDis = {"filterName":"CivilCourtDistrict", "filterArray":foundList.filters.civilDis}
            var judDis = {"filterName":"JudicialDistrict", "filterArray":foundList.filters.judDis}
            var regDate = {"filterName":"RegistrationDate", "filterArray":foundList.filters.regDate}

            var idList = foundList.idList;
            if(idList === ""){
                var idClause = ""
            }else{
                var idClause = "ID IN (" + idList + ")";
            }

            var filterList = [city, zipCode, dob, gender, polAff, voterType, yearLastVoted, electDis,
                              assemDis, congDis, counDis, senDis, civilDis, judDis, regDate]

            if(fields.length > 0){
                var selectString = fields.toString().replace(/\s/g,'').replace("DateofBirth", "DOB").replace("PoliticalAffiliation", "PoliticalParty").replace("CongressionalDistrict","CongressDistrict").replace(".", "");           
                selectString = "ID," + selectString;
            }
            else{
                var selectString = "*"
            }

            var whereList = [];
            
            for(var i=0; i<filterList.length; i++){
                if(filterList[i]["filterArray"].length > 0){
                    if(filterList[i]["filterName"] === 'DOB' || filterList[i]["filterName"] === 'RegistrationDate'){
                        whereList.push("STR_TO_DATE(" + filterList[i]["filterName"] + ", '%Y-%m-%d')" + " BETWEEN " + "'" + filterList[i]["filterArray"][0].substr(0,10) + "'" + " AND " + "'" + filterList[i]["filterArray"][0].substr(13,22) + "'");
                    }
                    else{
                        whereList.push(filterList[i]["filterName"] + " IN " + "(" + "'" + filterList[i]["filterArray"].join("','") + "'" + ")");
                    }
                }
            }

            if(whereList.length > 0 && idClause !== ""){
                var whereString = whereList.join(" AND ")
                var sql = "SELECT " + selectString + " FROM voters WHERE " + whereString + " AND " + idClause + ";";
            }
            else if(whereList.length > 0){
                var whereString = whereList.join(" AND ")
                var sql = "SELECT " + selectString + " FROM voters WHERE " + whereString + ";";
            }
            else if(idClause !== ""){
                var sql = "SELECT " + selectString + " FROM voters WHERE " + idClause + ";";
            }
            else{
                var sql = "SELECT " + selectString + " FROM voters;";
            }

            mysqlConnection.query(sql, function(err, data, fields) {
                if(err){
                    console.log(err); 
                }
                else{
                    // console.log(req.flash('error'));
                    res.render('lists-show', {flashMsg: req.flash('message'), flashType: req.flash('type'), title:"voters", userData:data, list:foundList});
                }
            });
        }
    });
});

router.put('/:id', isLoggedIn, function(req, res, next) {

    if(req.user.userRole !== 'Viewer'){
        var highlight = req.body.colorData;
        var customCols = req.body.customColDict;
        
        List.findOneAndUpdate({_id: req.params.id}, {$set: {"highlight": highlight, "customCols": customCols}}).exec(function(err, foundList){
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

router.delete('/:id', isLoggedIn, isViewerListId, function(req, res, next) {
    List.findByIdAndRemove(req.params.id).exec(function(err, foundList){
        if(err){
            res.redirect("/Politiker/lists")
            console.log(err);
        }
        else{
            res.redirect("/Politiker/lists")
        }
    });
});

module.exports = router;

