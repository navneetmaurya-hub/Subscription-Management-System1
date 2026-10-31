const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { clientUrl, nodeEnv } = require('./config/env');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
app.use(helmet());
app.use(cors({ origin: clientUrl, credentials: true }));
app.use(compression());
app.use(express.json({ limit: '1mb' }));
if (nodeEnv !== 'test') app.use(morgan('dev'));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);
module.exports = app;
