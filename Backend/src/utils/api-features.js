function buildQuery(modelQuery, query) {
  const page = Number(query.page || 1);
  const limit = Math.min(Number(query.limit || 10), 50);
  const skip = (page - 1) * limit;

  return modelQuery.skip(skip).limit(limit).sort({ createdAt: -1 });
}

module.exports = { buildQuery };
