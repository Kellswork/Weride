import express from 'express';

import rides from '../models/ride';

import validateInput from '../validator/ride';


const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json(rides);
});

router.get('/:rideId', (req, res) => {
  const ride = rides.find(c => c.id === parseInt(req.params.rideId, 10));
  if (!ride) {
    res.status(404).send('Ride not found');
  }
  res.status(200).json(ride);
});

router.post('/', (req, res) => {
  const { error } = validateInput(req.body);

  if (error) res.status(400).send(error.details[0].message);

  const ride = {
    id: rides.length + 1,
    name: req.body.name,
    from: req.body.from,
    to: req.body.to,
    time: req.body.time,
    date: req.body.date,
  };
  rides.push(ride);
  res.status(200).json(rides);
});

router.post('/:rideId/requests', (req, res) => {
  const ride = rides.find(c => c.id === parseInt(req.params.rideId, 10));
  const requests = {
    rideId: ride,
    name: req.body.name,
  };
  res.status(200).json({
    Details: ride,
    message: `${requests.name} has requested to join your ride`,
  });
});


export default router;
