var express = require('express');
var router = express.Router();
const user_controller = require('../controllers/userController');
const message_controller = require('../controllers/messageController');
const passport = require('passport');
const {isAuth, isMember, isAdmin, alreadyAdmin, alreadyMember} = require('../middleware/authMiddleware');

/* GET home page. */

router.use((req, res, next) => {
  if (req.user) {
      res.locals.is_logged = true;
  } else {
      res.locals.is_logged = false;
  }
  if (req.user && req.user.is_admin) {
    res.locals.is_admin = true;
  } else {
    res.locals.is_admin = false;
  }
  if (req.user && req.user.is_member) {
    res.locals.is_member = true;
  } else {
    res.locals.is_member = false;
  }
  next();
});
// TODO pagina principal con todos los mensajes!!!
router.get('/', message_controller.message_all);

router.get('/signup', user_controller.user_create_get);
router.post('/signup', user_controller.user_create_post);
router.get('/login', user_controller.user_login_get);
router.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: '/'}));
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if(err) {
      return next(err);
    }
    res.redirect('/');
  });
});
router.get('/get-membership', alreadyMember, user_controller.user_member_get);
router.post('/get-membership', alreadyMember, user_controller.user_member_post);
router.get('/get-admin', alreadyAdmin, user_controller.user_admin_get);
router.post('/get-admin', alreadyAdmin, user_controller.user_admin_post);
router.get('/protected-route', isAuth, (req, res, next) => {
  res.send('You made it to the route.');
});
router.get('/create-message', isAuth, message_controller.message_create_get);
router.post('/create-message', isAuth, message_controller.message_create_post);
router.get('/posts/:id/delete', isAdmin, message_controller.message_delete_get);
router.post('/posts/:id/delete', isAdmin, message_controller.message_delete_post);

module.exports = router;
