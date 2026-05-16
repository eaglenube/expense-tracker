const ok = (res, data, status = 200) => res.status(status).json({ ok: true, data });

const fail = (res, message, status = 400, details = undefined) =>
  res.status(status).json({
    ok: false,
    error: details ? { message, details } : { message },
  });

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { ok, fail, asyncHandler };
