const service = require('../../services/income.service');
const { buildPagination, paginate } = require('../../utils/pagination');
const { ok, fail, asyncHandler } = require('../../utils/api-response');

const list = asyncHandler(async (req, res) => {
  const { page, limit } = buildPagination({ page: req.query.page, limit: req.query.limit });
  const { rows, count } = await service.list(req.user.id, {
    search: req.query.search,
    payment_method: req.query.payment_method,
    from_date: req.query.from_date,
    to_date: req.query.to_date,
    sort: req.query.sort,
    order: req.query.order,
    page,
    limit,
  });
  return ok(res, { items: rows, pagination: paginate(count, page, limit) });
});

const show = asyncHandler(async (req, res) => {
  const item = await service.findById(req.params.id, req.user.id);
  if (!item) return fail(res, 'Income not found', 404);
  return ok(res, { item });
});

const create = asyncHandler(async (req, res) => {
  const item = await service.create(req.user.id, req.body, req.file);
  return ok(res, { item }, 201);
});

const update = asyncHandler(async (req, res) => {
  const item = await service.update(req.params.id, req.user.id, req.body, req.file);
  if (!item) return fail(res, 'Income not found', 404);
  return ok(res, { item });
});

const destroy = asyncHandler(async (req, res) => {
  const removed = await service.remove(req.params.id, req.user.id);
  if (!removed) return fail(res, 'Income not found', 404);
  return ok(res, { message: 'Deleted' });
});

module.exports = { list, show, create, update, destroy };
