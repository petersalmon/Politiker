const express = require("express");
const Router = express.Router();
const mysqlConnection = require("../connections/mysql-connection");

Router.get("/",function(req,res){
    mysqlConnection.query("SELECT * FROM voters LIMIT 10", function(err,rows,fields){
        if(err){
            console.log(err);
        }
        else{
            res.send(rows);
        }
    });
});

module.exports = Router;