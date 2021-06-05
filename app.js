const express = require('express');
const { json, urlencoded } = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const authRouter = require('./src/routes/authRoutes.js');
const postRouter = require('./src/routes/postRoutes.js');

const app = express();

/**
 * Limits the particular user to 1000 requests when a single ip
 */
const apiLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 5 minutes
    max: 1000,
});
app.use(morgan('dev'));
app.set('trust proxy', true);
app.use(helmet());
app.use(cors());
app.use(apiLimiter);
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.use(authRouter);
app.use(postRouter);

app.all('*', async (req, res) => {
    res.status(404).send('you lost, contact support!!');
});

module.exports = app;
