import express from 'express';

import bodyParser from 'body-parser';

import rides from '../routes/rides';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
/* app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, PATCH, DELETE');
    res.status(200).json({});
  }
  next();
}); */

app.use('/api/v1/rides', rides);


app.use((req, res, next) => {
  const error = new Error('page Not Found');
  error.status = 404;
  next(error);
});

const port = process.env.PORT || 4500;
const server = app.listen(port, () => console.log(`app started on ${port}`));

export default server;
