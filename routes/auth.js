import Router from 'express-promise-router';
import User from '../controllers/users';

const router = new Router();

export default router;

router.post('/signup', User.createUser);
router.post('/login', User.loginUser);
