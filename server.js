const express = require("express");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const SECRET = "supersecretkey";

function getUsers() {
  return JSON.parse(fs.readFileSync("users.json"));
}

function saveUsers(users) {
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
}

app.post("/signup", async (req, res) => {

  const { username, email, password } = req.body;
  const users = getUsers();

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({
    id: Date.now(),
    username,
    email,
    password: hashedPassword
  });

  saveUsers(users);

  res.json({ message: "Signup successful" });

});

app.post("/login", async (req, res) => {

  const { email, password } = req.body;
  const users = getUsers();

  const user = users.find(u => u.email === email);

  if (!user) return res.status(400).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "7d" });

  res.json({ token, username: user.username });

});

app.get("/dashboard", (req, res) => {

  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, SECRET);
    res.json({ message: "Welcome to dashboard", user: decoded });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }

});

app.listen(3000, () => console.log("Server running on port 3000"));
