const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "change-me";

const menu = [
  { id: 1, name: "Espresso", price: 80 },
  { id: 2, name: "Cappuccino", price: 120 },
  { id: 3, name: "Latte", price: 140 },
  { id: 4, name: "Cold Coffee", price: 160 }
];

const orders = [];

// Public home page
app.get("/", (req, res) => {
  res.send("Welcome to Bhaskar Coffee Shop ☕");
});

// Public menu
app.get("/api/menu", (req, res) => {
  res.json(menu);
});

// Public order API
app.post("/api/orders", (req, res) => {
  const { customerName, itemId, quantity } = req.body;

  const item = menu.find(i => i.id === Number(itemId));

  if (!customerName || !item || !quantity) {
    return res.status(400).json({
      error: "customerName, itemId and quantity are required"
    });
  }

  const order = {
    id: orders.length + 1,
    customerName,
    item: item.name,
    quantity,
    total: item.price * quantity
  };

  orders.push(order);

  res.status(201).json(order);
});

// Health endpoint for Kubernetes
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

// Protected admin middleware
function authenticate(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || auth !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(401).json({
      error: "Unauthorized"
    });
  }

  next();
}

// Protected admin API
app.get("/api/admin/orders", authenticate, (req, res) => {
  res.json(orders);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Coffee shop running on port ${PORT}`);
});
