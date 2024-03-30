import app from './app.js';
import mongoose from 'mongoose';

// console.log(app.get('env'))//by default the express sets the environment of our code to be development type.

const DB = process.env.DATABASE;

mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((connect) => {
    // console.log('connect==>', connect);
    console.log('\x1b[32mDB connected successfully !!\x1b[0m');
  });

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`\x1b[33mThe app is running on ${port}\x1b[0m`);
});
