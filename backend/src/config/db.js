const mongoose = require('mongoose');
const { mongoUri } = require('./env');

module.exports = async function connectDB() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, { maxPoolSize: 20 });
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
};
