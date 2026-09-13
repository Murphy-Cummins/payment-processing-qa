const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/payments.bd', (err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
    } else {
        console.log('Connected to payments database.');
    }
});

module.exports = db; 