const authService = require('../services/auth.service');

const showLogin = (req, res) => {
  res.render('auth/login', { title: 'Login', layout: 'layouts/auth', form: {} });
};

const showRegister = (req, res) => {
  res.render('auth/register', { title: 'Register', layout: 'layouts/auth', form: {} });
};

const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    req.session.user = authService.sessionUser(user);
    req.flash('success', `Welcome aboard, ${user.full_name}!`);
    res.redirect('/dashboard');
  } catch (err) {
    if (err.status === 409 || err.status === 400) {
      req.flash('error', err.message);
      return res.status(err.status).render('auth/register', {
        title: 'Register',
        layout: 'layouts/auth',
        form: req.body,
      });
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await authService.verify(req.body);
    req.session.user = authService.sessionUser(user);
    if (req.body.remember) {
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
    }
    req.flash('success', `Welcome back, ${user.full_name}!`);
    res.redirect('/dashboard');
  } catch (err) {
    if (err.status === 401) {
      req.flash('error', err.message);
      return res.status(401).render('auth/login', {
        title: 'Login',
        layout: 'layouts/auth',
        form: req.body,
      });
    }
    next(err);
  }
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
};

module.exports = { showLogin, showRegister, register, login, logout };
