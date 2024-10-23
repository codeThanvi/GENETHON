const express = require('express');
const { getAllLogs } = require('../controllers/callLogController');
const { verifyToken, checkRole } = require('../utils/jwt');
const router = express.Router();

router.get('/', verifyToken, checkRole(['ADMIN', 'MANAGER']), getAllLogs);

module.exports = router;
