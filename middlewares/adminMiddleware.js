const userData = require("../data/orderUserData");
const users = userData.users;
const isAdminMiddleware = (req, res, next) => {
    const loginUser = req.header("name"); 
    const user = users.find(user => user.name === loginUser);
    if (!user) {
      return res.status(401).json({ error: "User not existed." });
    }
    if (user.role !== "admin"){
      return res.status(401).json({ error: `${user.name} has no access.` });
    }
    next(); 
};

module.exports = isAdminMiddleware;
