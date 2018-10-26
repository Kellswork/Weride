import db from './db/index';


const createRideOffer = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
  rideOffers(id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  from VARCHAR(100) NoT NULL,
  destination VARCHAR(100) NoT NULL,
  time VARCHAR(100) NOT NULL,
  date VARCHAR() NOT NULL,
  user_id REFERENCES users(id),
  created_date TIMESTAMP,
  modified_date TIMESTAP
)`;
  db.query(queryText)
    .then((result) => {
      console.log('created successfully', result);
    }).catch((err) => {
      console.log(err, err.stack);
    });
};

export default createRideOffer;
