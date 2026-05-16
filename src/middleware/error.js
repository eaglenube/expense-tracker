const notFoundHandler = (req, res, _next) => {
  res.status(404).render('errors/404', { title: 'Not Found', layout: 'layouts/auth' });
};

const errorHandler = (err, req, res, _next) => {
  console.error('[error]', err);
  const status = err.status || 500;
  if (req.xhr || req.headers.accept?.includes('application/json')) {
    return res.status(status).json({ error: err.message || 'Internal Server Error' });
  }
  res.status(status).render('errors/500', {
    title: 'Error',
    layout: 'layouts/auth',
    message: err.message || 'Something went wrong.',
  });
};

module.exports = { notFoundHandler, errorHandler };
