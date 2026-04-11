const mongoose = require('mongoose');

async function connectDatabase() {
    try {
        const port = process.env.LOCAL_DB_PORT || 27017;
        const url = `mongodb://localhost:${port}/appDB`;
        await mongoose.connect(url);

        console.log('Database connected successfully');
    } catch (err) {
        console.error('Database connection error:', err);
    }
}

module.exports = connectDatabase;
