import Router from 'express-promise-router';
import Rideoffers from '../controllers/rideoffers';
import auth from '../middleware/authorization';
import Requests from '../controllers/requests';


const router = new Router();

export default router;

router.get('/', Rideoffers.getAllRideOffers);

router.get('/:rideId', Rideoffers.getOneRideOffer);

router.post('/:rideId/requests', auth, Requests.createRequests);

router.delete('/:rideId', auth, Rideoffers.deleteRideOffer);
