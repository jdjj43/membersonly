const mongoose = require('mongoose');
const Message = require('./message');
require('dotenv').config();

const Schema = mongoose.Schema;
mongoose.connect(process.env.MONGO_URI);

const UserSchema = new Schema({
  full_name: { type: String, required: true, maxLength: 100 },
  email: { type: String, required: true },
  hash: { type: String, required: true},
  salt: { type: String, required: true },
  is_member: Boolean,
  is_admin: Boolean,
})

UserSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/user/${this._id}`;
});

module.exports = mongoose.model("User", UserSchema);