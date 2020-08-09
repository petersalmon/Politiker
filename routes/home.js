const express = require("express");
const router = express.Router();
const List = require("../models/lists");
const Camp = require("../models/campaigns");
const mysqlConnection = require("../connections/mysql-connection");

// Function to check if user is logged in

function isLoggedIn(req, res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/Politiker/login");
}

router.get("/", isLoggedIn, function(req,res){
    List.find({}).sort({created: 'descending'}).limit(3).exec(function(err, lists){
        Camp.find({}).sort({created: 'descending'}).limit(3).exec(function(err, camps){

            var sql = "SELECT DISTINCT campaign, campaign_type FROM campaign_progress;"

            mysqlConnection.query(sql, function (err, selectOptions, fields) {
                if(err){
                    console.log(err);
                }
                else{
                    var campDict = {};
                    selectOptions.forEach(function(row){
                        var camp = row.campaign;
                        var campType = row.campaign_type;
                        campDict[camp] = campType;
                    });
                    res.render("home", {lists: lists, camps: camps, campDict: JSON.stringify(campDict)});
                }
            });
        });
    });
});

// get data for the graph
router.get("/graph", isLoggedIn, function(req,res){

    console.log(req.query);

    var campaign = req.query.campaign;
    var campType = req.query.campType;

    var attribute = req.query.attribute;

    if(campType === 'phone'){
        if(attribute === 'Contact'){
            attribute = 'Called';
        }
        else if(attribute === 'Response'){
            attribute = 'Spoken To';
        }
        else if(attribute === 'Support'){
            attribute = 'Level of Support';
        }
    }
    else if(campType === 'email'){
        if(attribute === 'Contact'){
            attribute = 'Emailed';
        }
        else if(attribute === 'Response'){
            attribute = 'Responded';
        }
        else if(attribute === 'Support'){
            attribute = 'Level of Support';
        }
    }
    else if(campType === 'door'){
        if(attribute === 'Contact'){
            attribute = 'Visited';
        }
        else if(attribute === 'Response'){
            attribute = 'Spoken To';
        }
        else if(attribute === 'Support'){
            attribute = 'Level of Support';
        }
    }

    var date = req.query.date;
    var startDate = date.substring(0, 10);
    var endDate = date.substring(13, 23);

    // for line graphs
    if(attribute !== 'Level of Support'){

        var sql = "select date, count from campaign_progress where campaign = '" + campaign + "' and attribute = '" + attribute + "' and date between '" + startDate + "' and '" + endDate + "' order by date;"

        mysqlConnection.query(sql, function (err, data, fields) {
            if(err){
                console.log(err);
            }
            else{
                var dateList = [];
                var countList = [];
    
                data.forEach(function(row){
                    dateList.push(row['date']);
                    countList.push(row['count']);
                });
    
                data = {
                    date: dateList,
                    count: countList
                }
    
                res.send(data);
            }
        }); 
    }
    // for bar graph
    else{
        var today = new Date();
        var todayDate = today.getFullYear() + '-' + ('0' + (today.getMonth()+1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);

        var sql = "select value, count from campaign_progress where campaign = '" + campaign + "' and attribute = 'Level of Support' and date = (select max(date) from campaign_progress);"

        mysqlConnection.query(sql, function (err, data, fields) {
            if(err){
                console.log(err);
            }
            else{
                
                var resultDict = {};
    
                data.forEach(function(row){
                    resultDict[row['value']] = row['count'];
                });
                res.send(resultDict);
            }
        });
    }
});

// AT 11:59 PM EACH DAY , GET THE counts FROM EACH CAMPAIGN AND SAVE AS ROW IN SQL
var now = new Date();

var dateToday = new Date();
var dd = String(dateToday.getDate()).padStart(2, '0');
var mm = String(dateToday.getMonth() + 1).padStart(2, '0'); 
var yyyy = dateToday.getFullYear();

dateToday = yyyy + '-' + mm + '-' + dd;

var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 0, 0) - now;
if (millisTill10 < 0) {
     millisTill10 += 86400000; 
}
setTimeout(function(){

    Camp.find({}, function(err, camps){

        if(err){
            console.log(err);
        }
        else{
            // console.log(camps);

            var valueList = [];

            camps.forEach(function(camp){

                if(camp['counts'].length > 0){

                    console.log(camp['title']);
                    console.log(camp['type']);
                    console.log(camp['counts']);

                    // console.log(camp['counts'][0]);
                    // console.log(camp['counts'][1]);
                    // console.log(camp['counts'][2]);
                    // console.log(camp['counts'][3]);

                    if(camp['type'] === 'phone'){

                        valueList.push([dateToday, camp['title'], camp['type'], 'Total Voter', 'Count', camp['counts'][0]])
                        valueList.push([dateToday, camp['title'], camp['type'], 'Called', 'Yes', camp['counts'][1]])
                        valueList.push([dateToday, camp['title'], camp['type'], 'Spoken To', 'Yes', camp['counts'][2]])
                        valueList.push([dateToday, camp['title'], camp['type'], 'Level of Support', 'Null', camp['counts'][3]['0']])
                        valueList.push([dateToday, camp['title'], camp['type'], 'Level of Support', 'Support', camp['counts'][3]['Support']])
                        valueList.push([dateToday, camp['title'], camp['type'], 'Level of Support', 'Opposed', camp['counts'][3]['Opposed']])
                        valueList.push([dateToday, camp['title'], camp['type'], 'Level of Support', 'Undecided', camp['counts'][3]['Undecided']])
                    }
                    if(camp['type'] === 'email'){

                        valueList.push([dateToday, camp['title'], camp['type'], 'Total Voter', 'Count', camp['counts'][0]])
                        valueList.push([dateToday, camp['title'], camp['type'], 'Emailed', 'Yes', camp['counts'][1]])
                        valueList.push([dateToday, camp['title'], camp['type'], 'Responded', 'Yes', camp['counts'][2]])
                        valueList.push([dateToday, camp['title'], camp['type'], 'Level of Support', 'Null', camp['counts'][3]['0']])
                        valueList.push([dateToday, camp['title'], camp['type'], 'Level of Support', 'Support', camp['counts'][3]['Support']])
                        valueList.push([dateToday, camp['title'], camp['type'], 'Level of Support', 'Opposed', camp['counts'][3]['Opposed']])
                        valueList.push([dateToday, camp['title'], camp['type'], 'Level of Support', 'Undecided', camp['counts'][3]['Undecided']])

                    }
                    if(camp['type'] === 'door'){

                        valueList.push([dateToday, camp['title'], camp['type'], 'Total Voter', 'Count', camp['counts'][0]])
                        valueList.push([dateToday, camp['title'], camp['type'], 'Visited', 'Yes', camp['counts'][1]])
                        valueList.push([dateToday, camp['title'], camp['type'], 'Spoken To', 'Yes', camp['counts'][2]])
                        valueList.push([dateToday, camp['title'], camp['type'], 'Level of Support', 'Null', camp['counts'][3]['0']])
                        valueList.push([dateToday, camp['title'], camp['type'], 'Level of Support', 'Support', camp['counts'][3]['Support']])
                        valueList.push([dateToday, camp['title'], camp['type'], 'Level of Support', 'Opposed', camp['counts'][3]['Opposed']])
                        valueList.push([dateToday, camp['title'], camp['type'], 'Level of Support', 'Undecided', camp['counts'][3]['Undecided']])

                    }
                }
            });

            // console.log(valueList);

            var sql = "INSERT INTO campaign_progress (DATE, CAMPAIGN, CAMPAIGN_TYPE, ATTRIBUTE, VALUE, COUNT) VALUES ?";
            mysqlConnection.query(sql, [valueList], function(err, results) {
                if (err) throw err;
                    console.log(valueList.length.toString() + " record(s) inserted");
            });
        }
    })
}, millisTill10);

// router.post("/", isLoggedIn, function(req,res){
//     List.create(req.body.list, function(err, newList){
//         if(err){
//             console.log(err);
//         }
//         else{
//             console.log(req.body.list);
//             res.redirect("/Politiker/lists")
//         }
//     });
// });

module.exports = router;