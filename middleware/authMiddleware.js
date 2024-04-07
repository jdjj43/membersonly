module.exports.isAuth = (req, res, next) => {
  if(req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/login?message=auth');
  }
}
module.exports.isMember = (req, res, next) => {
  if(req.isAuthenticated() && req.user.is_member) {
    next()
  } else {
    res.redirect('/');
  }
}
module.exports.alreadyMember = (req, res, next) => {
  if(req.isAuthenticated() && !req.user.is_member) {
    next();
  } else {
    res.redirect('/');
  }
}
module.exports.isAdmin = (req, res, next) => {
  if(req.isAuthenticated() && req.user.is_admin) {
    next();
  } else {
    res.redirect('/');
  }
}

module.exports.alreadyAdmin = (req, res, next) => {
  if(req.isAuthenticated() && !req.user.is_admin) {
    next();
  } else {
    res.redirect('/');
  }
}