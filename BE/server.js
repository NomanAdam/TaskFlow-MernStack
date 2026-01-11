require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./config/db");
const todosRoutes = require("./routes/todosRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware cors() lets your frontend (React) talk to your backend (Node/Express) even if both are running on different ports or domains.
app.use(cors());
//Accept JSON and parse the json bodies
app.use(express.json());
// Routes sending the request to the correct route file
// "/api/todos"==> this is the base route it is middleware
app.use("/api/todos", todosRoutes);
app.use("/api/auth", authRoutes);

// Health Check
app.get("/", (req, res) => res.send("Server is running"));
//start the server
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
