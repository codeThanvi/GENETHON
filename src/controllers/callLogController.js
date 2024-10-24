const { PrismaClient } = require('@prisma/client');
const { Parser } = require('json2csv');
const prisma = new PrismaClient();

// Get all call logs
const getAllLogs = async (req, res) => {
  try {
    const logs = await prisma.callLog.findMany();
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve call logs' });
  }
};

// Get recent 5 call logs
const recentCallLogs = async (req, res) => {
  try {
    const logs = await prisma.callLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve recent call logs' });
  }
};

// Get average call duration
const averageCallTime = async (req, res) => {
  try {
    const logs = await prisma.callLog.findMany();
    const totalDuration = logs.reduce((sum, log) => sum + log.duration, 0);
    const averageDuration = totalDuration / logs.length;
    res.json({ averageDuration });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve average call time' });
  }
};

// Get outgoing call logs
const outgoingCalls = async (req, res) => {
  try {
    const logs = await prisma.callLog.findMany({ where: { callType: 'OUTGOING' } });
    if (logs.length === 0) {
      return res.json({ message: 'No outgoing calls' });
    }
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve outgoing call logs' });
  }
};

// Get incoming call logs
const incomingCalls = async (req, res) => {
  try {
    const logs = await prisma.callLog.findMany({ where: { callType: 'INCOMING' } });
    if (logs.length === 0) {
      return res.json({ message: 'No incoming calls' });
    }
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve incoming call logs' });
  }
};


// Sentiment analysis breakdown
const sentimentBreakdown = async (req, res) => {
  try {
    const positiveCalls = await prisma.callLog.count({ where: { sentiment: 'POSITIVE' } });
    const negativeCalls = await prisma.callLog.count({ where: { sentiment: 'NEGATIVE' } });
    const neutralCalls = await prisma.callLog.count({ where: { sentiment: 'NEUTRAL' } });
    res.json({ positive: positiveCalls, negative: negativeCalls, neutral: neutralCalls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve sentiment breakdown' });
  }
};

// Find the longest call
const longestCall = async (req, res) => {
  try {
    const call = await prisma.callLog.findFirst({ orderBy: { duration: 'desc' } });
    res.json(call);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve the longest call' });
  }
};


// Get daily call volume
const dailyCallVolume = async (req, res) => {
  try {
    const logs = await prisma.callLog.groupBy({
      by: ['timestamp'],
      _count: { id: true },
      orderBy: { timestamp: 'asc' },
    });
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve daily call volume' });
  }
};

// Get average call time per user
const averageCallTimePerUser = async (req, res) => {
  try {
    const logs = await prisma.callLog.groupBy({
      by: ['Name'],
      _avg: { duration: true },
    });
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve average call time per user' });
  }
};

// Export call logs to CSV
const exportCallLogsToCSV = async (req, res) => {
  try {
    const logs = await prisma.callLog.findMany();
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(logs);
    res.header('Content-Type', 'text/csv');
    res.attachment('call_logs.csv');
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to export call logs to CSV' });
  }
};

// Get call type distribution
const callTypeDistribution = async (req, res) => {
  try {
    const incomingCalls = await prisma.callLog.count({ where: { callType: 'INCOMING' } });
    const outgoingCalls = await prisma.callLog.count({ where: { callType: 'OUTGOING' } });
    res.json({ incoming: incomingCalls, outgoing: outgoingCalls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve call type distribution' });
  }
};

// Search by transcript
const searchByTranscript = async (req, res) => {
  const { keyword } = req.query;
  try {
    const logs = await prisma.callLog.findMany({
      where: {
        transcript: {
          contains: keyword,
        },
      },
    });
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to search call logs by transcript' });
  }
};


const paginatedCallLogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const skip = (page - 1) * pageSize;

  try {
    const logs = await prisma.callLog.findMany({
      skip,
      take: pageSize,
    });
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve paginated call logs' });
  }
};

// Exporting all the controllers
module.exports = {
  getAllLogs,
  recentCallLogs,
  averageCallTime,
  outgoingCalls,
  incomingCalls,
  sentimentBreakdown,
  longestCall,
  
  dailyCallVolume,
  averageCallTimePerUser,
  exportCallLogsToCSV,
  callTypeDistribution,
  searchByTranscript,
  paginatedCallLogs,
};
