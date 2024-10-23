
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.json())




// Mount routes
const authRoutes = require('./routes/auth');
const callLogRoutes = require('./routes/callLogs');

app.use('/api/auth', authRoutes);
app.use('/api/call-logs', callLogRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});