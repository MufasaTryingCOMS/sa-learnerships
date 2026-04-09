const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// serve static files (if you use frontend in /public)
app.use(express.static("public"));

// routes
app.use("/api/users", userRoutes);

 const PORT = process.env.SERVER_PORT || 3000;
 app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`);
 });
