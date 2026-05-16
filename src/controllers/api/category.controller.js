const service = require('../../services/category.service');
const { buildPagination, paginate } = require('../../utils/pagination');
const { ok, fail, asyncHandler } = require('../../utils/api-response');

const list = asyncHandler(async (req, res) => {
  const { page, limit } = buildPagination({ page: req.query.page, limit: req.query.limit });
  const { rows, count } = await service.list(req.user.id, {
    search: req.query.search,
    page,
    limit,
  });
  return ok(res, { items: rows, pagination: paginate(count, page, limit) });
});

const dropdown = asyncHandler(async (req, res) => {
  const items = await service.dropdown(req.user.id);
  return ok(res, { items });
});

const show = asyncHandler(async (req, res) => {
  const item = await service.findById(req.params.id, req.user.id);
  if (!item) return fail(res, 'Category not found', 404);
  return ok(res, { item });
});

const create = asyncHandler(async (req, res) => {
  const item = await service.create(req.user.id, req.body);
  return ok(res, { item }, 201);
});

const update = asyncHandler(async (req, res) => {
  const item = await service.update(req.params.id, req.user.id, req.body);
  if (!item) return fail(res, 'Category not found', 404);
  return ok(res, { item });
});

const destroy = asyncHandler(async (req, res) => {
  await service.remove(req.params.id, req.user.id);
  return ok(res, { message: 'Deleted' });
});

module.exports = { list, dropdown, show, create, update, destroy };
