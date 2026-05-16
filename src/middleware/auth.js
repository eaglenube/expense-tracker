const requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  if (req.xhr || req.headers.accept?.includes('application/json')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  req.flash('error', 'Please log in to continue.');
  return res.redirect('/login');
};

const requireGuest = (req, res, next) => {
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  }
  next();
};

module.exports = { requireAuth, requireGuest };
