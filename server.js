const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const NodeCache = require('node-cache');
const contactRoutes = require('./routes/contacts');
const errorHandler = require('./middleware/errorHandler');
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, `.env.${process.env.NODE_ENV || 'development'}`)
});

console.log(`Running in ${process.env.NODE_ENV || 'development'} mode`);

const app = express();
const cache = new NodeCache({ stdTTL: 300 }); // 5 minute cache

// Middleware
app.use(cors());
app.use(express.json());

// Cache middleware
app.use((req, res, next) => {
  req.cache = cache;
  next();
});

// Routes
app.use('/api/contacts', contactRoutes);

// Error handling
app.use(errorHandler);

// MongoDB connection
mongoose.connect('mongodb://mongodb:27017/contacts_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 