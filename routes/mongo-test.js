const express = require("express");
const Router = express.Router();
const mongoConnection = require("../connections/mongo-connection");

Router.get("/",function(req,res){
    res.send("Welcome to the Mongoose DB connection! Don't break anything ...")
});

module.exports = Router;