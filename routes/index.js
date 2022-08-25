const express = require('express');

const AppCon = require('../controllers/AppController');
const UserCon = require('../controllers/UsersController');
const AuthCon = require('../controllers/AuthController');

const router = express.Router();
// GET routes
router.get('/status', AppCon.getStatus);
router.get('/stats', AppCon.getStats);
router.get('/connect', AuthCon.getConnect);
router.get('/disconnect', AuthCon.getDisconnect);
router.get('/users/me', UserCon.getMe);


// POST routes
router.post('/users', UserCon.createUser);

module.exports = router;
