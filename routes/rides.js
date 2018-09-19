import express from 'express';

import rides from '../models/ride';


const router = express.Router();

router.get('/', (req, res) => res.status(200).send(rides));

router.get('/:rideId', (req, res) => {
  const ride = rides.find(c => c.id === parseInt(req.params.rideId, 10));
  if (!ride) {
    return res.status(404).send('Ride not found');
  }
  return res.status(200).send(ride);
});

router.post('/', (req, res) => {
  const ride = {
    id: rides.length + 1,
    name: req.body.name,
    from: req.body.from,
    to: req.body.to,
    time: req.body.time,
    date: req.body.date,
  };
  rides.push(ride);
  return res.status(201).send({
    message: 'Ride Created',
    createdRide: ride,
  });
});

router.post('/:rideId/requests', (req, res) => {
  const ride = rides.find(c => c.id === parseInt(req.params.rideId, 10));
  const requests = {
    rideId: ride,
    name: req.body.name,
  };
  res.status(201).json({
    Details: ride,
    message: `${requests.name} has requested to join your ride`,
  });
});


export default router;
