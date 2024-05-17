import express, {Router} from 'express';

const router: Router = express.Router();
const userController = require('../controllers/user');

router.post('/users', userController.signup);
router.post('/users/signup', userController.signup);
router.post('/users/login', userController.login);
router.post('/users/signin', userController.login);

module.exports = router;