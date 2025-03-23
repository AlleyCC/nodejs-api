const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const getFormattedTime = require("../utils/timeHelpers");
let todos = require("../data/todoData"); 

// 1. `GET /todos` - 取得所有待辦事項列表。
router.get('/', (req, res) => {
  res.json(todos);
})
// 2. `GET /todos/:id` - 取得特定待辦事項的詳細內容。
router.get('/:id', (req, res) => {
  const todo = todos.find(todo => todo.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ error: "Todo not found."});
  res.json(todo);
})
// 3. `POST /todos` - 新增待辦事項（需要 `title`）。
router.post('/', (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() == "") return res.status(400).json({ error: "Todo list content is required." });
  const id = uuidv4();
  const createTime = getFormattedTime();
  const newTodo = {
    id,
    title,
    createTime,
    completed: false,
    updateTime: createTime
  };
  todos.push(newTodo)
  res.status(201).json(newTodo);
})
// 4. `DELETE /todos/:id` - 刪除待辦事項。
router.delete('/:id', (req, res) => {
  const todoIndex = todos.findIndex(todo => todo.id === parseInt(req.params.id));
  if (todoIndex === -1) return res.status(404).json({ error: "Todo item not found." });
  todos.splice(todoIndex, 1);
  res.status(201).json({ message: "Todo list deleted succesfully." });
})
// 5. `PATCH /todos/:id` - 更新 `title` 或標記為 `completed`。
router.patch('/:id', (req, res) => {
  const {  title, completed  } = req.body;
  const todoIndex = todos.findIndex(todo => todo.id === parseInt(req.params.id));
  if (todoIndex === -1) return res.status(400).json({ error: "Todo list item not found." });
  if (title) todos[todoIndex].title = title;
  if (completed) todos[todoIndex].completed = completed;
  todos[todoIndex].updateTime = getFormattedTime();
  res.json(todos[todoIndex]);
})
// - `title` 不能為空。
// - `completed` 預設為 `false`，但可以更新。
// - 若 `id` 不存在，應回傳 `404` 錯誤。
module.exports = router;
