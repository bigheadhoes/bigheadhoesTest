const { Schema, model } = require("mongoose");

const memberSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  xp: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 0,
  },
  balance: {
    type: Number,
    default: 0,
  },
},
{
    timestamps: true
});

module.exports = model("Member", memberSchema);
