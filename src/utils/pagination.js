const buildPagination = ({ page = 1, limit = 10 }) => {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
  return { page: p, limit: l, offset: (p - 1) * l };
};

const paginate = (count, page, limit) => {
  const totalPages = Math.max(1, Math.ceil(count / limit));
  return {
    page,
    limit,
    totalPages,
    totalItems: count,
    hasPrev: page > 1,
    hasNext: page < totalPages,
    prevPage: Math.max(1, page - 1),
    nextPage: Math.min(totalPages, page + 1),
  };
};

const buildQueryString = (query, override = {}) => {
  const merged = { ...query, ...override };
  const params = new URLSearchParams();
  Object.entries(merged).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, v);
  });
  const s = params.toString();
  return s ? `?${s}` : '';
};

module.exports = { buildPagination, paginate, buildQueryString };
