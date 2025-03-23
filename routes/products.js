const express = require("express");
const router = express.Router();
const authMiddleware = require("..//middlewares/authMiddleware.js");
const getFormattedTime = require("../utils/timeHelpers");
const { v4: uuidv4 } = require('uuid');
let products = require("../data/productData"); 

// name 不能重複，price 必須為數字，stock 不能為負數。
// 1. `GET /products` - 取得所有商品列表。
router.get('/', (req, res) => {
  res.json(products);
})

// 2. `GET /products/:id` - 取得特定商品的詳細資訊。
router.get('/:id', (req, res) => {
  const product = products.find(product => product.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: "Product not found."});
  res.json(product);
})

// 3. `POST /products` - **（限管理員）** 新增商品（需要 `name`、`price`、`stock`）。
router.post('/', authMiddleware,(req, res) => {
  const { name, price, stock } = req.body;
  if (!name || name.trim() == "") {
    return res.status(400).json({ error: "Name is required." });
  };
  if (!price || (typeof price !== "number" && isNaN(price))) {
    return res.status(400).json({ error: "Price must be integer." })
  };
  if (!stock || stock < 0) {
    return res.status(400).json({ error: "Name is required." });
  };
  const createTime = getFormattedTime();
  const id = uuidv4();
  const newproduct = {
    id,
    name,
    price,
    stock,
    createTime,
    updateTime: createTime
  };
  products.push(newproduct)
  res.status(201).json(newproduct);
})

// 4. `PATCH /products/:id` - **（限管理員）** 更新商品的 `name`、`price` 或 `stock`。
router.patch('/:id', authMiddleware,(req, res) => { 
  const { name, price, stock } = req.body;
  const product = products.find(product => product.id === parseInt(req.params.id));
  if (!product) return res.status(400).json({ error: "product not found." });

   if (!name || name.trim() == "") {
    return res.status(400).json({ error: "Name is required." });
  };
  if (!price || (typeof price !== "number" && isNaN(price))) {
    return res.status(400).json({ error: "Price must be integer." })
  };
  if (!stock || stock < 0) {
    return res.status(400).json({ error: "Stock is required." });
  };
  
  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  product.updateTime = getFormattedTime();
  res.json(product);
})

// 5. `DELETE /products/:id` - **（限管理員）** 刪除商品。
router.delete('/:id', authMiddleware,(req, res) => {
  const productIndex = products.findIndex(product => product.id === parseInt(req.params.id));
  if (productIndex === -1) return res.status(404).json({ error: "product not found." });
  products.splice(productIndex, 1);
  res.status(201).json({ message: "product deleted succesfully." });
})
module.exports = router;
