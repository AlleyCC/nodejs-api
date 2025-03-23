const express = require('express')
const app = express();
const cors = require("cors");

app.use(cors()); 
//routes
const userRoutes = require("./routes/users");
const todoRoutes = require("./routes/todos");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");


//routes
app.use(express.json());
app.use("/users", userRoutes);
app.use("/todos", todoRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

// app.get('/', (req, res) => {
//   res.json({ message: 'Users route' });
// });

const port = 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

