import express, {Router} from 'express';

const router: Router = express.Router();
const userController = require('../controllers/user');
const taskController = require('../controllers/task');

router.post('/users', userController.signup);
router.post('/users/signup', userController.signup);
router.post('/users/login', userController.login);
router.post('/users/signin', userController.login);

router.post('/users/:id/tasks', taskController.createTask);
router.get('/users/:userID/tasks', taskController.retrieveMultipleTasks);
router.get('/users/:userID/tasks/:taskID', taskController.retrieveIndividualTask);
router.put('/users/:userID/tasks/:taskID', taskController.updateTask);

module.exports = router;