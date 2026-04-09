const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDatabase = require('./database.js');
const opportunitiesRouter = require('./opportunities/routes.js');

const userRoutes = require("./routes/userRoutes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// serve static files (if you use frontend in /public)
app.use(express.static("public"));

// routes
app.use("/api/users", userRoutes);

app.use('/opportunities', opportunitiesRouter);

// 404 Error handling middleware
app.use((req, res, next) => {
    const url = req.url;
    const httpMethod = req.method;
    res.status(404).json({ error: httpMethod + ' ' + url + ' not found' });
});

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
    connectDatabase();
    console.log(`Server running on port ${PORT}`);
});
