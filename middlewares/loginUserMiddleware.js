/* **身份驗證 Middleware**：

- 用戶可查詢自己的訂單，但不能查詢其他用戶的訂單。
- 只有管理員能夠刪除訂單。
- 可在 header 帶 `name: cindy` 來驗證是不是管理員或是該用戶
*/
const userData = require("../data/orderUserData");
const users = userData.users;
const isLoginUserMiddleware = (req, res, next) => {
    const loginUser = req.header("name"); 
    const user = users.find(user => user.name === loginUser);
    if (!user) {
      return res.status(401).json({ error: "User not existed." });
    }
    next(); 
};

module.exports = isLoginUserMiddleware;
