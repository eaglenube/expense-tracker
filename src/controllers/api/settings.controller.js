const service = require('../../services/settings.service');
const { ok, asyncHandler } = require('../../utils/api-response');

const get = asyncHandler(async (req, res) => {
  const settings = await service.getForUser(req.user.id);
  return ok(res, { settings });
});

const update = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    monthly_summary_enabled:
      req.body.monthly_summary_enabled === true ||
      req.body.monthly_summary_enabled === 'true' ||
      req.body.monthly_summary_enabled === 'on'
        ? 'true'
        : 'false',
  };
  const settings = await service.updateForUser(req.user.id, payload);
  return ok(res, { settings });
});

module.exports = { get, update };
