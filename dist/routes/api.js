"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const userController = require('../controllers/user');
router.post('/users', userController.signup);
router.post('/users/signup', userController.signup);
router.post('/users/login', userController.login);
router.post('/users/signin', userController.login);
module.exports = router;
