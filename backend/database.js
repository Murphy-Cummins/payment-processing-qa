const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(
    __dirname,
    "../database/payments.db"
);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Connected to payments database.");
    }
});

module.exports = db;