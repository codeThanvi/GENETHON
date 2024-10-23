const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { verifyToken } = require('../utils/jwt');

const getAllLogs = async (req, res) => {
  try {
    const logs = await prisma.callLog.findMany();
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve call logs' });
  }
};

const recentCallLogs = async (req, res) => {
  try {
    const logs = await prisma.callLog.findMany();
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve call logs' });
  }
};
module.exports = { getAllLogs };  