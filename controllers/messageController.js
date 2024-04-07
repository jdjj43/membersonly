const { body, validationResult } = require("express-validator");
const Message = require("../models/message");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

exports.message_create_get = (req, res, next) => {
  console.log(req.user);
  res.render("create_message", {
    title: "Create New Message",
    message: {},
    errors: {},
    is_logged: req.user ? true : false,
  });
};

exports.message_create_post = [
  body("title", "You must define a title")
    .isString()
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "You must define a message")
    .isString()
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const newMessage = new Message({
      title: req.body.title,
      time_stamp: new Date(),
      description: req.body.description,
      user: req.user,
    });
    if (!errors.isEmpty()) {
      res.render("create_message", {
        title: "Create New Message",
        message: newMessage,
        errors: errors,
        ...res.locals,
      });
    } else {
      newMessage.save();
      res.redirect("/");
    }
  }),
];

exports.message_delete_get = asyncHandler(async (req, res, next) => {
  const _id = req.params.id;

  if(!isValidObjectId(_id)) {
    const err = new Error("Message not found");
    err.status = 404;
    return next(err);
  } else {
    const messageData = await Message.findOne({_id: req.params.id});

    if(!messageData) {
      const err = new Error("Message not found");
      err.status = 404;
      return next(err);
    } else {
      res.render("delete_message", {
        title: `Delete "${messageData.title}"`,
        message: messageData,
        ...res.locals,
      });
    }
  }
});

exports.message_delete_post = asyncHandler(async (req, res, next) => {
  await Message.findByIdAndDelete(req.body.id);
  res.redirect("/");
});

exports.message_all = asyncHandler(async (req, res, next) => {
  const messages = await Message.find({}).populate("user");
  res.render("index", {
    title: "Message Wall",
    messages: messages,
    ...res.locals,
  });
});
