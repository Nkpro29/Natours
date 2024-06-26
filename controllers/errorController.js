const errorHandler = (err, req, res, next) => {
  console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
  next();
};

export default errorHandler;
