import { Client } from 'pg';

import config from '../../config/config';

let client;

if (process.env.NODE_ENV === 'development') {
  client = new Client(config.development);
}

if (process.env.NODE_ENV === 'test') {
  client = new Client(config.test);
}


const db = {
  query: (text, params) => client.query(text, params),
};

export default db;
