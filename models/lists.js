const mongoose = require("mongoose");

const listSchema = mongoose.Schema({
    title: {type: String, default: "Title"},
    description: {type: String, default: "Description"},
    creator: {type: String, default: "Peter Salamon"},
    created: {type: Date, default: Date.now},
    database: {type: String, default: "nyc"},
    table: {type: String, default: "voters"},
    fields: {type: Array, default: []},
    filters: {
        city: {type: Array, default: []},
        zipCode: {type: Array, default: []},
        dob: {type: Array, default: []},
        gender: {type: Array, default: []},
        polAff: {type: Array, default: []},
        voterType: {type: Array, default: []},
        yearLastVoted: {type: Array, default: []},
        electDis: {type: Array, default: []},
        assemDis: {type: Array, default: []},
        congDis: {type: Array, default: []},
        counDis: {type: Array, default: []},
        senDis: {type: Array, default: []},
        civilDis: {type: Array, default: []},
        judDis: {type: Array, default: []},
        regDate: {type: Array, default: []}
    },
    idList: {type: String, default: ""},
    highlight: {
                red: {type: Array, default: []},
                yellow: {type: Array, default: []},
                orange: {type: Array, default: []},
                green: {type: Array, default: []},
                blue: {type: Array, default: []}
               },
    customCols: {type: Object, default: {}}
});

module.exports = mongoose.model("List",listSchema);