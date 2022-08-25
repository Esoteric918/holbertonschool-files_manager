const express = require('express');

const AppCon = require('../controllers/AppController');
// const UserCon = require('../controllers/UserController');


const router = express.Router();

router.get('/status', AppCon.getStatus);
router.get('/stats', AppCon.getStats);

module.exports = router;
