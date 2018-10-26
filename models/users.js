import db from './db/index';

const createUser = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
  users(id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_date TIMESTAMP,
  modified_date TIMESTAP
)`;
  db.query(queryText)
    .then((result) => {
      console.log('succesfully created: ', result);
    }).catch((err) => {
      console.log(err, err.stack);
    });
};

export default createUser;
