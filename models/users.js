const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

// Note that the username is equivalent to the email; email is used to login

const userSchema = mongoose.Schema({
    firstName: {type: String},
    lastName: {type: String},
    username: {type: String, 
               unique: true},
    password: {type: String},
    emailToken: {type: String},
    isVerified: {type: Boolean, 
                default: false},
    userRole: {type: String, 
               default: 'Viewer'},
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: Date}
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
