const mongoose = require("mongoose");

const scriptScehma = mongoose.Schema({
    type: {type: String, default: "Type"},
    title: {type: String, default: "Title"},
    creator: {type: String, default: "Author"},
    created: {type: Date, default: Date.now},
    content: {type: String, default: "Content"}
});

module.exports = mongoose.model("Script",scriptScehma); 