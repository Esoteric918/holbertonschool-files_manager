const express = require('express');

const AppCon = require('../controllers/AppController');
const UserCon = require('../controllers/UsersController');

const router = express.Router();
// GET routes
router.get('/status', AppCon.getStatus);
router.get('/stats', AppCon.getStats);

// POST routes
router.post('/users', UserCon.createUser);

module.exports = router;
