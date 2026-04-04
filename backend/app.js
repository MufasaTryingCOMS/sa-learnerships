const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDatabase = require('./common/database');
const Routes = require('./authorization/routes');
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use('/', Routes);
const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
