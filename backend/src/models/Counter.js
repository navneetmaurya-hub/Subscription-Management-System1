const mongoose = require('mongoose');
const counterSchema = new mongoose.Schema({ _id: String, seq: { type: Number, default: 0 } });
const Counter = mongoose.model('Counter', counterSchema);

// Atomic sequence generator, e.g. nextSeq('SUB') -> "SUB-000001"
Counter.nextSeq = async (key, pad = 6) => {
  const c = await Counter.findByIdAndUpdate(key, { $inc: { seq: 1 } }, { new: true, upsert: true });
  return `${key}-${String(c.seq).padStart(pad, '0')}`;
};
module.exports = Counter;
