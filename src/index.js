import express from 'express';

import bodyParser from 'body-parser';

import rides from '../routes/rides';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1/rides', rides);


app.use((req, res, next) => {
  const error = new Error('page Not Found');
  error.status = 404;
  next(error);
});

const port = process.env.PORT || 4500;
const server = app.listen(port, () => console.log(`app started on ${port}`));

export default server;
