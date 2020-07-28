const mongoose = require("mongoose");

const campaignSchema = mongoose.Schema({
    type: {type: String},
    title: {type: String, default: "Title"},
    creator: {type: String, default: "Author"},
    description: {type: String, default: "Description"},
    created: {type: Date, default: Date.now},
    listIds: {type: Array, default: []},
    highlight: {
        red: {type: Array, default: []},
        yellow: {type: Array, default: []},
        orange: {type: Array, default: []},
        green: {type: Array, default: []},
        blue: {type: Array, default: []}
       },
    customCols: {type: Object, default: {}},
    counts: {type: Object, default: {}}
});

module.exports = mongoose.model("Camp",campaignSchema);
