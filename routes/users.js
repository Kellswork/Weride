import Router from 'express-promise-router';
import auth from '../middleware/authorization';
import Rideoffers from '../controllers/rideoffers';
import Requests from '../controllers/requests';


const router = new Router();

export default router;

router.post('/rides', auth, Rideoffers.createRideOffer);
router.get('/rides/:rideId/requests', auth, Requests.getRideRequests);
router.get('/rides/', auth, Rideoffers.getUserRideOffer);
router.get('/requests/', auth, Requests.getUserRideRequest);
router.put('/rides/:rideId/requests/:requestId', auth, Requests.responseToRequest);
