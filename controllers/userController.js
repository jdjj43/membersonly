const { body, validationResult } = require("express-validator");
const User = require('../models/user');
const asyncHandler = require("express-async-handler");
const genHashPassword = require("../lib/passwordUtils").genPassword;
const passport = require('passport');

exports.user_create_get = (req, res, next) => {
  res.render("sign_up_form", {
    title: "Sign Up!",
    user: {},
    errors: [],
  });
};

exports.user_create_post = [
  body("name", "Your name must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("last_name", "Your lastname must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("email")
    .isEmail()
    .custom(async (value) => {
      const existingUser = await User.findOne({ email: value });
      if (existingUser) {
        throw new Error('An user already exists with this email address.');
      }
    }),
  body(
    "password1",
    "Your password must not be empty and must contain at least 6 characters, including at least one uppercase letter and one special character."
  )
    .isLength({ min: 6 })
    .isStrongPassword()
    .escape(),
  body("password2").custom((value, { req }) => {
    return value === req.body.password1;
  }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const saltHash = genHashPassword(req.body.password1);
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    const user = new User({
      full_name: `${
        req.body.name.slice(0, 1).toUpperCase() + req.body.name.slice(1)
      } ${
        req.body.last_name.slice(0, 1).toUpperCase() +
        req.body.last_name.slice(1)
      }`,
      email: req.body.email,
      hash: hash,
      salt: salt,
      is_member: false,
      is_admin: false,
    });
    if (!errors.isEmpty()) {
      console.log(errors);
      res.render("sign_up_form", {
        title: "Sign Up!",
        user: user,
        errors: errors.array(),
      });
    } else {
      await user.save();
      res.redirect('/login');
    }
  }),
];

exports.user_login_get = (req, res, next) => {
  let message = ''
  if(req.query.message === 'auth') {
    message = 'Please login to access that content..';
  } else if(req.query.message === 'admin') {
    message = 'You need to login as an admin to access that content..';
  }
  if(req.isAuthenticated()) {
    res.redirect('protected-route');
  } else {
    res.render("login_form", {
      title: "Login",
      message: message,
    });
  }
};

exports.user_member_get = (req, res, next) => {
  res.render('get_membership', {
    title: 'Get Membership',
    secret_code_message: 'Enter the secret code to get your membership: ',
    errors: {},
    ...res.locals
  })
}

exports.user_member_post = asyncHandler( async (req, res, next) => {
  if(req.body.secret === 'secreto') {
    const userMembership = new User({
      is_member: true,
      _id: req.user._id,
    });
    const updateUserMembership = await User.findByIdAndUpdate(req.user._id, userMembership, {});
    res.redirect('/');
  } else {
    res.render('get_membership', {
      title: 'Membership',
      errors: { errors: ['Wrong Password'] },
      is_logged: req.user ? true : false,
    })
  }
});

exports.user_admin_get = (req, res, next) => {
  res.render('get_membership', {
    title: 'Get Admin',
    secret_code_message: 'Enter the secret code in order to get admin rigths: ',
    errors: {},
    is_logged: req.user ? true : false,
  })
}

exports.user_admin_post = asyncHandler( async (req, res, next) => {
  if(req.body.secret === 'adminsecreto') {
    const userMembership = new User({
      is_admin: true,
      _id: req.user._id,
    });
    const updateUserAdmin = await User.findByIdAndUpdate(req.user._id, userMembership, {});
    res.redirect('/');
  } else {
    res.render('get_membership', {
      title: 'Admin',
      errors: { errors: ['Wrong Password'] },
      is_logged: req.user ? true : false,
    })
  }
});