const path = require("path");
const mysql = require("mysql");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override")
const passport = require("passport");
const passportLocal = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const expressSession = require("express-session");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const cookieParser = require("cookie-parser")
const flash = require("express-flash");

const mysqlConnection = require("./connections/mysql-connection");
const mongoConnection = require("./connections/mongo-connection");
const authRoutes = require("./routes/auth");
const homeRoutes = require("./routes/home");
const listRoutes = require("./routes/lists");
const mapRoutes = require("./routes/maps");
const campaignRoutes = require("./routes/campaigns");
const voterProfileRoutes = require("./routes/voter-profiles");
const scriptRoutes = require("./routes/scripts");
const contactRoutes = require("./routes/contact");
const accountRoutes = require("./routes/account");

const app = express();
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(bodyParser.json({limit: "50mb"}));
app.use(methodOverride('_method'));

app.use(cookieParser("sessionEncoder-Decoder"));

app.use(expressSession ({
    secret: "sessionEncoder-Decoder",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// AUTHORIZATION ROUTES
app.use("/politiker-web-app.herokuapp.com", authRoutes);

// HOME ROUTE
app.use("/Politiker/home", homeRoutes);

// MAPS ROUTE
app.use("/Politiker/maps", mapRoutes);

// LISTS ROUTES
app.use("/Politiker/lists", listRoutes);

// CAMPAIGNS ROUTES
app.use("/Politiker/campaigns", campaignRoutes);

// VOTER PROFILES ROUTES
app.use("/Politiker/voter-profiles", voterProfileRoutes);

// SCRIPTS ROUTES
app.use("/Politiker/scripts", scriptRoutes);

// CONTACT ROUTES
app.use("/Politiker/contact", contactRoutes);

// ACCOUNT ROUTES
app.use("/Politiker/account", accountRoutes);

// Catch all other routes
app.get("*",function(req,res){
    res.send("Welcome to the void! You've taken a wrong turn.");
});

// Listen to this port
const PORT = process.env.PORT || 8000;
app.listen(PORT);