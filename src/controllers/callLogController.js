const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { verifyToken } = require('./jwt');

const getAllLogs = async (req, res) => {
  try {
   
    verifyToken(req, res);

    const logs = await prisma.callLog.findMany();
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve call logs' });
  }
};

module.exports = { getAllLogs };