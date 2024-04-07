const mongoose = require('mongoose');
require('dotenv').config();
const { format } = require('date-fns');
const User = require('./user')

const Schema = mongoose.Schema;
mongoose.connect(process.env.MONGO_URI);

const MessageSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  time_stamp: { type: Date },
  description: { type: String, required: true, maxLength: 1500 },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
})

MessageSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/posts/${this._id}`;
});

MessageSchema.virtual("time_stamp_formatted").get(function () {
  return format(this.time_stamp, "MMM dd, yyyy hh:mm a");
});

module.exports = mongoose.model("Message", MessageSchema);