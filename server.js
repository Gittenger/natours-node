const dotenv = require('dotenv');
//config dotenv before requiring app file
dotenv.config();
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  process.exit(1);
});

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

//connect app to database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
    //for checking db connection errors
    // useUnifiedTopology: false
  })
  .then(() => {
    console.log('db connection successful');
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  //close server, then end application
  server.close(() => {
    //arg 1 stands for unhandled rejection
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('💥 SIGTERM RECEIVED, shutting down gracefully');
  server.close(() => {
    console.log('❌ Process terminated');
  });
});
