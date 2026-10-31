const { port } = require('./config/env');
const connectDB = require('./config/db');
const app = require('./app');
const startJobs = require('./jobs');

(async () => {
  await connectDB();
  startJobs();
  app.listen(port, () => console.log(`API running on http://localhost:${port}`));
})().catch((err) => {
  console.error('Startup failed:', err);
  process.exit(1);
});
