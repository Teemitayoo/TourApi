const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
//MIDDLEWARES

app.use(helmet()); //sets security http headers

if (process.env.NODE_ENV === 'development') {
  //only print params to console when we are in development
  app.use(morgan('dev'));
}
//limits request from same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, //1 hour
  message: 'Too many requests fromm this IP, please try again in an hour!'
});

app.use('/api', limiter);
//body parser, read data from body into req.body
app.use(express.json({ limit: '10kb' })); //middleware for post http, creste natours

//data sanitization against nosql query injection
app.use(mongoSanitize()); //filter out query injection like {$gt:}

//data sanitization against xss
app.use(xss());
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratinngsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
); //prevent parameter pollution

app.use(express.static(`${__dirname}/public`)); //To render static files like overview.html

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); //middleware for knowing today's date and putting it in code
  //console.log(req.headers);
  next();
});

//ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
// TO HANDLE URLS NOT VALID
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });
  // const err = new Error(
  //   `Can't find ${req.originalUrl} on this server`
  // );
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
//ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);
module.exports = app;
