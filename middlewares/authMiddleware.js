const validApiKey = "123456789";

const authMiddleware = (req, res, next) => {
    const apiKey = req.header("x-api-key"); 
    if (!apiKey) {
        return res.status(401).json({ error: "Missing API Key" });
    }

    if (apiKey !== validApiKey) {
        return res.status(403).json({ error: "No access" });
    }
    next(); 
};

module.exports = authMiddleware;
