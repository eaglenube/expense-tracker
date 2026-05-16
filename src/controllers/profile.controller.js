const service = require('../services/profile.service');
const { User } = require('../../models');

const index = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.session.user.id);
    res.render('profile/index', { title: 'Profile', user });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await service.updateProfile(req.session.user.id, req.body);
    if (user) {
      req.session.user = { id: user.id, full_name: user.full_name, email: user.email };
      req.flash('success', 'Profile updated.');
    }
    res.redirect('/profile');
  } catch (err) {
    if (err.status) {
      req.flash('error', err.message);
      return res.redirect('/profile');
    }
    next(err);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    await service.updatePassword(req.session.user.id, req.body);
    req.flash('success', 'Password updated.');
    res.redirect('/profile');
  } catch (err) {
    if (err.status) {
      req.flash('error', err.message);
      return res.redirect('/profile');
    }
    next(err);
  }
};

module.exports = { index, updateProfile, updatePassword };
