const loggerMiddleware = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}  Order updated.`);
    next();
};

module.exports = loggerMiddleware;