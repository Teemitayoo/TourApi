const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message); //For all errors not caught in the application
  console.log('UNCAUGHT EXCEPTION, SHUTTING DOWN....');
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  //for databse account, Franklin
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
//connecting to database
mongoose
  .connect(DB, {
    useNewUrlParser: true, //For depreciation, incase of old edition mongoose
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() =>
    console.log('DB connection successfull')
  );

/* const testTour = new Tour({
  name: 'The Park Camper',
  price: 497,
});

testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log('ERROR:', err);
  }); //save document to database */

//console.log(process.env);
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Running on port ${port}..`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message); //For all errors not caught in the application
  console.log(
    'UNHANDLED REJECTION, SHUTTING DOWN....'
  );
  server.close(() => {
    process.exit(1);
  });
});
