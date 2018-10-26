import dotenv from 'dotenv';
import db from '../models/db/index';

dotenv.config();

class Requests {
  static async createRequests(req, res) {
    const {
      rideId,
    } = req.params;

    const {
      rows,
    } = await db.query('select * from rideoffers where ride_id = $1', [rideId]);
    if (!rows[0]) {
      res.status(404).json({
        status: 'error',
        message: 'ride does not exists',
      });
    } else if (rows[0].seats_available < 1) {
      res.status(400).json({
        message: ' there are no seats available for this ride',
      });
    } else if (rows[0].user_id === req.userData.id.id) {
      res.status(400).json({
        status: 'error',
        message: 'You cannot request to join a ride you created',
      });
    } else {
      let result = await db.query(`select user_id, ride_id from riderequests where ride_id = ${rideId} AND user_id = ${req.userData.id.id}`);
      if (result.rowCount >= 1) {
        res.status(400).json({
          error: 'You cannot send a request to the same ride offer twice',
        });
      } else {
        result = await db.query('INSERT into riderequests(name, user_id, ride_id) VALUES($1, $2, $3) RETURNING *', [req.userData.name.name, req.userData.id.id, rideId]);

        try {
          res.status(201).json({
            message: ' Your Ride request has been created',
            details: result.rows[0],
          });
        } catch (error) {
          res.status(500).json({
            error: 'could not create ride please try again later',
          });
        }
      }
    }
  }

  static async getRideRequests(req, res) {
    const {
      rideId,
    } = req.params;

    const {
      rows,
    } = await db.query(`SELECT name, status from riderequests where ride_id = ${rideId} `);
    if (rows.length < 1) {
      res.status(404).json({
        message: 'No request has been sent to join your ride',
      });
    } else {
      try {
        res.status(200).json({
          message: `${rows.length} request found for this ride offer`,
          details: `${rows[0].name} has requested to join your ride`,
          status: `${rows[0].status}`,
        });
      } catch (error) {
        res.status(500).send('an error occured while getting requests, please try again later');
      }
    }
  }

  static async getUserRideRequest(req, res) {
    const {
      rows,
    } = await db.query('select * from riderequests where user_id = $1', [req.userData.id.id]);
    if (rows.length < 1) {
      res.status(404).json({
        message: 'You have not sent any request to a ride offer yet',
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

  static async responseToRequest(req, res) {
    const {
      rideId,
      requestId,
    } = req.params;
    const {
      status,
    } = req.body;

    const result1 = await db.query(`SELECT * from rideoffers where ride_id = ${rideId}`);
    // checks if the ride offer exists before we can check if it has requests pending
    if (!result1.rows[0]) {
      res.status(404).json({
        message: 'Ride Offer was not found',
      });
      // the if else statement replaces the return that i would have used. eslint is annoying
    } else {
      let result2 = await db.query(`SELECT * from riderequests where ride_id = ${rideId}`);
      if (result2.rowCount < 1) {
        res.status(404).json({
          message: 'No request has been sent to join your ride',
        });
      } else if (result2.rowCount === 10) {
        res.status(400).json({
          message: 'Maximum request sent for this ride offer',
        });
      } else if (req.userData.id.id !== result1.rows[0].user_id) {
        res.status(403).json({
          status: 'error',
          message: 'You cannot accept or reject a request to a ride offer you did not create',
        });
      } else if (result2.rows[0].req_id === requestId && result2.rows[0].status !== 'pending') {
        res.status(400).json({
          status: 'error',
          message: 'You have already responded to this request',
        });
      } else if (status === 'rejected') {
        result2 = await db.query('UPDATE riderequests SET status = $1 WHERE req_id=$2', ['rejected', req.params.requestId]);
        try {
          res.status(200).json({
            message: 'request to join ride is rejected',
          });
        } catch (error) {
          res.status(500).send('an error occured while getting requests, please try again later');
        }
      } else if (status === 'accepted') {
        if (result1.rows[0].seats_available < 1) {
          res.status(400).json({
            message: 'Sorry, seats are no longer available for this ride',
          });
        } else {
          let {
            rows,
          } = await db.query('UPDATE riderequests SET status = $1 WHERE req_id = $2', ['accepted', requestId]);
          rows = await db.query('UPDATE rideoffers SET seats_available = seats_available - 1 WHERE ride_id = $1', [rideId]);
          try {
            res.status(200).json({
              message: 'request to join ride is accepted',
              details: rows[0],
            });
          } catch (error) {
            res.status(500).send('an error occured while getting requests, please try again later');
          }
        }
      }
    }
  }
}

export default Requests;
// export const createRequestController = createRequests;
// export const getRequestsController = getRideRequests;
// export const responseToRequestsController = responseToRequest;
// export const getUserRequestsController = getUserRideRequest;
