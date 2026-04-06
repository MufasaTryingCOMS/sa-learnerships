const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDatabase = require('./database.js');
const opportunitiesRouter = require('./opportunities/routes.js');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

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
