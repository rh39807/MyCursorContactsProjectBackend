module.exports = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message),
      details: err.message
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      message: 'A contact with this email already exists',
      details: `MongoDB Duplicate Key Error: ${JSON.stringify(err.keyValue)}`
    });
  }

  res.status(500).json({
    message: 'Internal Server Error',
    details: err.message
  });
}; 