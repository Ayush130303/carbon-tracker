const mongoose = require("mongoose");

const record = new mongoose.Schema({
  username: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", 
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  travel: {
    type: Number,
    required: true
  },
  electricity: {
    type: Number,
    required: true
  },
  gas_litre: {
    type: Number,
    required: true
  },
  waste: {
    type: Number,
    required: true
  },
  totalEmission: {
    type: Number,
    required: false
  }
});

module.exports = mongoose.model("record", record);
