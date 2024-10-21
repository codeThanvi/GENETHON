const { Pool } = require('pg');
const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Listen for notifications from PostgreSQL
pool.connect((err, client) => {
  if (err) {
    console.error('Could not connect to PostgreSQL:', err);
    return;
  }
  console.log('Connected to PostgreSQL for notifications.');

  client.on('notification', (msg) => {
    const payload = JSON.parse(msg.payload);
    console.log(`Received ${payload.operation} operation:`, payload.data);

    // Broadcast the event and data via WebSocket
    wss.clients.forEach((client) => {
      client.send(JSON.stringify(payload.data));
    });
  });

  client.query('LISTEN call_log_channel', (err) => {
    if (err) {
      console.error('Failed to listen to call_log_channel:', err);
    }
  });
});

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);
  });

  ws.on('error', (error) => {
    console.log(`Error occurred => ${error}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  // Send initial data
  pool.query('SELECT * FROM call_logs', (err, results) => {
    if (err) {
      console.error('Failed to retrieve call logs:', err);
    } else {
      ws.send(JSON.stringify(results.rows));
    }
  });
});

// Mount routes
const authRoutes = require('./routes/auth');
const callLogRoutes = require('./routes/callLog');

app.use('/api/auth', authRoutes);
app.use('/api/call-logs', callLogRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});