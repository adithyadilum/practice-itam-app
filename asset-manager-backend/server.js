require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");

const verifyToken = require("./middleware/authMiddleware");
const checkRole = require("./middleware/checkRole");

const app = express();

app.use(express.json());

/* =========================
   LOGIN ROUTE (Demo Only)
========================= */
app.post("/login", (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  // Hardcoded role for demo
  const role = username === "admin" ? "Admin" : "Viewer";

  const token = jwt.sign(
    { username, role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

/* =========================
   PROTECTED ROUTES
========================= */

//  Admin Only Route
app.get(
  "/admin-data",
  verifyToken,
  checkRole("Admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin. Sensitive data here." });
  }
);

//  Viewer + Admin Route
app.get(
  "/viewer-data",
  verifyToken,
  checkRole("Admin", "Viewer"),
  (req, res) => {
    res.json({ message: "Viewer or Admin can access this." });
  }
);

/* =========================
   SERVER START
========================= */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
