const express = require("express");
const router = express.Router();
const isAdminMiddleware = require("../middlewares/adminMiddleware");
const isLoginUserMiddleware = require("../middlewares/loginUserMiddleware");
const loggerMiddleware = require("../middlewares/loggerMiddleware.js");
const getFormattedTime = require("../utils/timeHelpers");
let productData = require("../data/orderProductData"); 
let products = productData.products;
let orderData = require("../data/orderData");
let orders = orderData.orders;

// 1. `GET /orders` - **（限管理員）** 取得所有訂單列表。
router.get('/', isAdminMiddleware,(req, res) => {
  res.json(orders);
})

// 2. `GET /orders/:id` - 取得特定訂單的詳細內容。
router.get('/:id', isLoginUserMiddleware,(req, res) => {
  const order = orders.find(order => order.id === parseInt(req.params.id));
  if (!order) return res.status(404).json({ error: "Order not found."});
  res.json(order);
})

// 3. `POST /orders` - **（需登入）** 用戶建立新訂單（需要 `productId`、`quantity`）。
//  quantity 必須大於 0，且該商品的 stock 必須足夠才能下單。
router.post('/', isLoginUserMiddleware, loggerMiddleware,(req, res) => {
  const { productId, quantity } = req.body;
  const product = products.find(product => product.productId === productId);
  if (!productId) { 
    return res.status(400).json({ error: "productId is required." });
  };
  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: "Quantity must be greater than 0." });
  };
  if (product.stock <= 0) {
    return res.status(400).json({ error: "Out of stock." })
  }
  
  const createTime = getFormattedTime();
  const id = Date.now();
  const newOrder = {
    "orderId": id,
    "productId": productId,
    "status": "pending",
    "quantity": quantity,
    "createTime": createTime,
    "updateTime": createTime
  };
  orders.push(newOrder);
  res.status(201).json(newOrder);
})

// 4. `PATCH /orders/:id` - **（限用戶）** 取消訂單。
router.patch('/:id', isLoginUserMiddleware, loggerMiddleware,(req, res) => { 
  const order = orders.find(order => order.id === parseInt(req.params.id));
  if (!order) return res.status(400).json({ error: "Order not found." });
  order.status = "canceled";
  order.updateTime = getFormattedTime();
  res.json(order);
})

// 5. `DELETE /orders/:id` - **（限管理員）** 刪除訂單。
router.delete('/:id', isAdminMiddleware, loggerMiddleware,(req, res) => {
  const orderIndex = orders.findIndex(order => order.id === parseInt(req.params.id));
  if (orderIndex === -1) return res.status(404).json({ error: "Order not found." });
  orders.splice(orderIndex, 1);
  res.status(201).json({ message: "Order deleted succesfully." });
})
module.exports = router;
