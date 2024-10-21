const express = require('express');
const { getAllLogs } = require('../controllers/callLogController');
const { verifyToken, checkRole } = require('../utils/jwt');
const router = express.Router();

router.get('/', verifyToken, checkRole(['admin', 'manager']), getAllLogs);

module.exports = router;
