import { Pool } from 'pg';

import config from '../../config/config';


let pool;

if (process.env.NODE_ENV === 'development') {
  pool = new Pool(config.development);
}

if (process.env.NODE_ENV === 'test') {
  pool = new Pool(config.test);
}

pool.connect()
  .then(() => {
    console.log(`connected to ${process.env.PGDATABASE}`);
  }).catch(() => {
    console.log('not connected');
  });

const db = {
  query: (text, params) => pool.query(text, params),
};

export default db;
