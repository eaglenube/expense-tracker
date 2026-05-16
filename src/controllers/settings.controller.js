const service = require('../services/settings.service');

const index = async (req, res, next) => {
  try {
    const settings = await service.getForUser(req.session.user.id);
    res.render('settings/index', { title: 'Settings', settings });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    await service.updateForUser(req.session.user.id, req.body);
    req.flash('success', 'Settings saved.');
    res.redirect('/settings');
  } catch (err) {
    next(err);
  }
};

module.exports = { index, update };
