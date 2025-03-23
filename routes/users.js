const express = require("express");
const router = express.Router();
let users = require("../data/userData"); 



// 1. `GET /users` - 取得所有會員列表。
router.get('/', (req, res) => {
  res.json(users);
})

// 2. `GET /users/:id` - 取得特定會員的詳細資訊。
router.get('/:id', (req, res) => {
  console.log(req.params.id)
  console.log(users)
  const user = users.find(user => user.id === parseInt(req.params.id));
   console.log(user)
  if (!user) return res.status(404).json({ error: "User not found."});
  console.log('here')
  res.json(user);
})

// 3. `POST /users` - 新增會員（需要 `name` 和 `email`）。**email不能重複
router.post('/', (req, res) => {
  const { name, email } = req.body;
  if (!name || name.trim() == "") return res.status(400).json({ error: "Name is required." });
  if (!email || email.trim() == "") return res.status(400).json({ error: "Email is required." });
  const emailRepeated = users.find(user => user.email === email);
  if (emailRepeated) return res.status(400).json({ error: "Email already registered." });
  const id = Date.now();
  const newUser = {
    id,
    name,
    email
  };
  users.push(newUser)
  res.status(201).json(newUser);
})

// 4. `DELETE /users/:id` - 刪除會員。
router.delete('/:id', (req, res) => {
  const userIndex = users.findIndex(user => user.id === parseInt(req.params.id));
  if (userIndex === -1) return res.status(404).json({ error: "User not found." });
  users.splice(userIndex, 1);
  res.status(201).json({ message: "User deleted succesfully." });
})

// 5. `PATCH /users/:id` - 更新會員的 `name` 或 `email`。**email不能重複
router.patch('/:id', (req, res) => { 
  const { name, email } = req.body;
  const user = users.find(user => user.id === parseInt(req.params.id));
  if (!user) return res.status(400).json({ error: "User not found." });

  const emailRepeated = users.find(user => user.email === email); 
  if (emailRepeated) return res.status(400).json({ error: "Email already registered." });
  
  if (name) user.name = name;
  if (email) user.email = email;
  res.json(user);
})
module.exports = router;

