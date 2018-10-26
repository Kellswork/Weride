import express from 'express';
import bodyParser from 'body-parser';
import ride from '../routes/rides';
import user from '../routes/users';
import auth from '../routes/auth';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(expressValidator());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, PATCH, DELETE');
    res.status(200).json({});
  }
  next();
});

app.use('/api/v1/rides', ride);
app.use('/api/v1/users', user);
app.use('/api/v1/auth', auth);

app.use((req, res, next) => {
  const error = new Error('page Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

const port = process.env.PORT || 8080;
const server = app.listen(port);
console.log(`app started on ${port}, ${process.env.NODE_ENV}`);

export default server;
