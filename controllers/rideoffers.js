import dotenv from 'dotenv';
import db from '../models/db/index';
import validateRide from '../middleware/rideValidation';

dotenv.config();

class Rideoffers {
  static async createRideOffer(req, res) {
    const { error } = validateRide(req.body);

    if (error) res.status(400).send(error.details[0].message);
    else {
      const {
        location,
        destination,
        time,
        date,
        seats,
      } = req.body;
      try {
        const { rows } = await db.query('INSERT into rideoffers(name, location, destination, time, date, user_id, seats_available) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', [req.userData.name.name, location, destination, time, date, req.userData.id.id, seats]);
        res.status(201).json({
          message: 'Ride offer was successfuly created!',
          ride: rows[0],
        });
      } catch (err) {
        res.status(500).send('an error occured while creating ride');
      }
    }
  }

  static async getAllRideOffers(req, res) {
    const result = await db.query('SELECT * FROM rideoffers LIMIT 6');
    if (result.rowCount < 1) {
      res.status(404).json({
        message: 'No ride offer has been created yet',
      });
    } else {
      try {
        res.status(200).json({
          message: `${result.rowCount} rides found`,
          rides: result.rows,
        });
      } catch (error) {
        res.status(500).send('an error occured while getting rides');
      }
    }

    // this controller does not need a catch block. it uses the 500 error set on index.js
  }

  static async getOneRideOffer(req, res) {
    const { rideId } = req.params;

    const { rows } = await db.query('SELECT * FROM rideoffers WHERE ride_id = $1', [rideId]);
    if (!rows[0]) {
      res.status(404).json({
        message: 'could not find ride',
      });
    } else {
      try {
        res.status(200).send(rows[0]);
      } catch (error) {
        res.status(500).send('could not find this address');
        // this doesnt use the error msg in index, it uses the catch error
      }
    }
  }

  static async getUserRideOffer(req, res) {
    const { rows } = await db.query('select * from rideoffers where user_id = $1', [req.userData.id.id]);
    if (rows.length < 1) {
      res.status(404).json({
        message: 'You have not created any ride offer yet',
      });
    } else {
      try {
        res.status(200).json({
          message: `${rows.length} rides found`,
          details: rows,
        });
      } catch (error) {
        res.status(500).send('please try again later');
      }
    }
  }

  static async deleteRideOffer(req, res) {
    let { rows } = await db.query(`SELECT * from rideoffers where ride_id = ${req.params.rideId}`);

    if (!rows[0]) {
      res.status(404).json({
        message: 'ride does not exist',
      });
    } else if (req.userData.id.id !== rows[0].user_id) {
      res.status(403).json({
        message: 'you cannot delete this ride',
      });
    } else {
      rows = await db.query(`DELETE from rideoffers where ride_id = ${req.params.rideId}`);
      try {
        res.status(200).json({
          message: 'ride offer has been deleted successfully',
          details: rows[0],
        });
      } catch (error) {
        res.status(500).send('an error occured while deleting ride please try again later');
      }
    }
  }
}

export default Rideoffers;
// export const getAllRideController = getAllRideOffers;
// export const getOneRideController = getOneRideOffer;
// export const createRideController = createRideOffer;
// export const getUserOffersController = getUserRideOffer;
// export const deleteRideController = deleteRideOffer;
