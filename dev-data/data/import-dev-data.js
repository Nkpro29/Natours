import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: './../../.env' });
import fs from 'fs';
import Tour from '../../models/tourModel.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const toursFilePath = path.resolve(__dirname, 'tours-simple.json');

mongoose
  .connect(
    'mongodb+srv://namankulshresth:fTsXjzyjhFUUk56@cluster0.1rhpmdo.mongodb.net/natours?retryWrites=true&w=majority',
    {
      // useCreateIndex: true,
      // useFindAndModify: false,
      // useUnifiedTopology: true,
    }
  )
  .then((con) => {
    // console.log(con.connections);
    console.log('DB connected successfully');
  })
  .catch((error) => {
    console.error(`error: ${error}`);
    process.exit(1);
  });

//Import data to DB
const tours = JSON.parse(fs.readFileSync(toursFilePath, 'utf-8'));

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('DB is successfully loaded');
  } catch (error) {
    console.error(error);
  }
  process.exit();
};

//delete data from DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('DB is successfully deleted');
  } catch (error) {
    console.error(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
