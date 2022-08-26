const express = require('express');

const AppCon = require('../controllers/AppController');
const UserCon = require('../controllers/UsersController');
const AuthCon = require('../controllers/AuthController');
const FilesCon = require('../controllers/FilesController');

const router = express.Router();
// GET routes
router.get('/status', AppCon.getStatus);
router.get('/stats', AppCon.getStats);
router.get('/connect', AuthCon.getConnect);
router.get('/disconnect', AuthCon.getDisconnect);
router.get('/users/me', UserCon.getMe);
router.get('files/:id', UserCon.getFile);
router.get('files', FilesCon.getFiles);
router.get('/files/:id/data', FilesCon.getFileData);

// POST routes
router.post('/users', UserCon.createUser);
router.post('/files', FilesCon.addFile);

// PUTS
router.put('/files/:id/publish', FilesCon.setPublic);
router.put('/files/:id/unpublish', FilesCon.setPrivate);
module.exports = router;
