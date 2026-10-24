/**
 * RFC 7807 Compliant Centralized Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

  const errorResponse = {
    type: err.type || "https://prescripto.health/errors/internal-server-error",
    title: err.title || "An unexpected clinical API error occurred",
    status: statusCode,
    detail: err.message || "Internal server error",
    instance: req.originalUrl,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  };

  console.error(`[Clinical API Error] ${req.method} ${req.originalUrl} - ${statusCode}:`, err.message);
  res.status(statusCode).json(errorResponse);
};

export default errorHandler;
