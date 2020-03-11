const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const viewRouter = require('./routes/viewRoutes');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

///////////////////////////////////////
//INITIALIZE APP AND SET VIEW ENGINE
const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

///////////////////////////////////////
//Middlewares (GLOBAL)
//IMPLEMENT CORS
//allows all requests coming from all origins
app.use(cors());
app.options('*', cors());

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
app.use(
  express.urlencoded({
    extended: true,
    limit: '10kb'
  })
);
app.use(cookieParser());

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

// //basic console logging middleware -- TEST MIDDLEWARES
// app.use((req, res, next) => {
//   // console.log('hello from the middleware 😁');
//   next();
// });

//create request time field for use in responses
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

//COMPRESS RESPONSE
app.use(compression());

//ROUTES
//VIEW ROUTER
app.use('/', viewRouter);
//API ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

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
