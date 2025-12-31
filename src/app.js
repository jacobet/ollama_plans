const express = require('express');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Root endpoint for basic status check
app.get('/', (req, res) => {
  res.json({
      message: 'Plans API Server',
      status: 'ready'
    });
  });

module.exports = app;