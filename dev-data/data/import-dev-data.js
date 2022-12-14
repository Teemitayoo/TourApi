//JUST A SCRIPT FOR IMPORTING, NOT NECESSARY IN DEVELOPMENT

const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');
dotenv.config({ path: './config.env' });

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
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successfull'));
//READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
//IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
//DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
