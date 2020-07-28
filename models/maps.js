const mongoose = require("mongoose");

const markerListSchema = mongoose.Schema({
    markerIds: {type: Array}
});

module.exports = mongoose.model("markerList",markerListSchema);
