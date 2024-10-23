const express = require('express');
const {
  getAllLogs,
  recentCallLogs,
  averageCallTime,
  outgoingCalls,
  incomingCalls,
  callLogsByDateRange,
  sentimentBreakdown,
  longestCall,
  callsByUser,
  dailyCallVolume,
  averageCallTimePerUser,
  exportCallLogsToCSV,
  callTypeDistribution,
  searchByTranscript,
  paginatedCallLogs,
} = require('../controllers/callLogController');

import { verifyToken } from '../utils/jwt';

const router = express.Router();

router.get('/logs',verifyToken,checkRole(['ADMIN','EMPLOYEE']), getAllLogs);
router.get('/logs/recent',verifyToken,checkRole(['ADMIN','EMPLOYEE']), recentCallLogs);
router.get('/logs/average-time',verifyToken,checkRole(['ADMIN','EMPLOYEE']), averageCallTime);
router.get('/logs/outgoing',verifyToken,checkRole(['ADMIN','EMPLOYEE']), outgoingCalls);
router.get('/logs/incoming',verifyToken,checkRole(['ADMIN','EMPLOYEE']), incomingCalls);
router.get('/logs/date-range',verifyToken,checkRole(['ADMIN','EMPLOYEE']), callLogsByDateRange);
router.get('/logs/sentiment-breakdown',verifyToken,checkRole(['ADMIN','EMPLOYEE']), sentimentBreakdown);
router.get('/logs/longest',verifyToken,checkRole(['ADMIN','EMPLOYEE']), longestCall);
router.get('/logs/user/:username',verifyToken,checkRole(['ADMIN','EMPLOYEE']), callsByUser);
router.get('/logs/daily-volume',verifyToken,checkRole(['ADMIN','EMPLOYEE']), dailyCallVolume);
router.get('/logs/average-time-per-user',verifyToken,checkRole(['ADMIN','EMPLOYEE']), averageCallTimePerUser);
router.get('/logs/export/csv',verifyToken,checkRole(['ADMIN','EMPLOYEE']), exportCallLogsToCSV);
router.get('/logs/distribution',verifyToken,checkRole(['ADMIN','EMPLOYEE']), callTypeDistribution);
router.get('/logs/search',verifyToken,checkRole(['ADMIN','EMPLOYEE']), searchByTranscript);
router.get('/logs/paginated',verifyToken,checkRole(['ADMIN','EMPLOYEE']), paginatedCallLogs);

module.exports = router;


