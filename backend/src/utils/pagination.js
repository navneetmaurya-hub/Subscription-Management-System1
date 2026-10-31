// Standard pagination: ?page=1&limit=20&sort=-createdAt
exports.paginate = (query) => {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(parseInt(query.limit) || 20, 100);
  return { page, limit, skip: (page - 1) * limit, sort: query.sort || '-createdAt' };
};
