import db from './db/index';

const createRideRequest = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
  riderequests(id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  user_id integer REFERENCES users(id)
  ride_id integer REFERNCES rideoffers(id),
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

export default createRideRequest;
