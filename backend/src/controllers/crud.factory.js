const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { paginate } = require('../utils/pagination');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

module.exports = (Model, { searchFields = [], populate = '' } = {}) => ({
  list: asyncHandler(async (req, res) => {
    const { page, limit, skip, sort } = paginate(req.query);
    const filter = { ...(req.baseFilter || {}) };
    if (req.query.search && searchFields.length)
      filter.$or = searchFields.map((f) => ({ [f]: new RegExp(escapeRegex(req.query.search), 'i') }));
    if (req.query.status) filter.status = req.query.status;

    const [data, total] = await Promise.all([
      Model.find(filter).sort(sort).skip(skip).limit(limit).populate(populate).lean(),
      Model.countDocuments(filter),
    ]);
    res.json({ success: true, data, meta: { page, limit, total, pages: Math.ceil(total / limit) } });
  }),

  get: asyncHandler(async (req, res) => {
    const doc = await Model.findOne({ _id: req.params.id, ...(req.baseFilter || {}) }).populate(populate);
    if (!doc) throw new AppError('Not found', 404);
    res.json({ success: true, data: doc });
  }),

  create: asyncHandler(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json({ success: true, data: doc });
  }),

  update: asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) throw new AppError('Not found', 404);
    res.json({ success: true, data: doc });
  }),

  remove: asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) throw new AppError('Not found', 404);
    res.json({ success: true, message: 'Deleted' });
  }),
});
