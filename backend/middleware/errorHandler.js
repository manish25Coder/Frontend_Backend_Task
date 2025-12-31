const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ 
      success: false,
      message: 'Validation Error', 
      errors 
    });
  }

 
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const value = err.keyValue[field];
    return res.status(400).json({ 
      success: false,
      message: `${field} '${value}' already exists` 
    });
  }


  if (err.name === 'CastError') {
    return res.status(400).json({ 
      success: false,
      message: `Invalid ${err.path}: ${err.value}` 
    });
  }

  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      success: false,
      message: 'Invalid token' 
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ 
      success: false,
      message: 'Token expired' 
    });
  }

  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;