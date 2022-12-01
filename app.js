require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xssClean = require('xss-clean');
const expressRateLimit = require('express-rate-limit');


// connentDB
const connentDB = require('./db/connect');
const authenticationUser = require('./middleware/authentications');

// routers
const authRouter = require('./routes/aurh');
const jobsRouter = require('./routes/jobs');


// Error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(expressRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes,
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}))
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xssClean());


// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticationUser, jobsRouter);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 1812;
const start = async () => {
  try {
    await connentDB(process.env.MONGO_URL);
    app.listen(port, console.log(`Server Listen In http://localhost:${port}`));
  } catch (error) {
    console.log(error)
  }
};

start()