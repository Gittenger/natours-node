const path = require('path');
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
const reviewRouter = require('./routes/reviewRoutes');

///////////////////////////////////////
//INITIALIZE APP AND SET VIEW ENGINE
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

///////////////////////////////////////
//Middlewares (GLOBAL)
//SERVING STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));
//SET SECURITY HTTP HEADERS
app.use(helmet());
//LOG INFO FOR DEV
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  //for using production mode and setting package.json script, install package
  //npm install -g win-node-env
}

//LIMIT REQUESTS -- 100/HR
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in one hour'
});
app.use('/api', limiter);

//BODY PARSER -- READ DATA FROM BODY INTO REQ.BODY
app.use(
  express.json({
    limit: '10kb'
  })
);

//DEFEND AGAINST NOSQL QUERY INJECTION
app.use(mongoSanitize());

//DEFEND AGAINST XSS -- DATA SANITIZATION
app.use(xss());

//PREVENT PARAMS POLLUTION
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

//basic console logging middleware -- TEST MIDDLEWARES
app.use((req, res, next) => {
  console.log('hello from the middleware 😁');
  next();
});

//create request time field for use in responses
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//ROUTES
//VIEW ROUTES
app.get('/', (req, res) => {
  res.status(200).render('base', {
    title: 'Exciting tours for exciting people',
    tour: 'The Forest Hiker',
    user: 'Jonas'
  });
});

app.get('/overview', (req, res) => {
  res.status(200).render('overview', {
    title: 'All Tours'
  });
});

app.get('/tour', (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour'
  });
});

//API ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

//For unhandled routes
//handle all verbs using app.all
//'*' stands for everything
app.all('*', (req, res, next) => {
  //if next() receives an argument, express assumes it's an error
  //will then skip all other middleware and send to global error-handler
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
