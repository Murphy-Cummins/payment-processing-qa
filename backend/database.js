// Import the sqlite3 package.
// .verbose() enables the additional debugging information from sqlite3.
const sqlite3 = require("sqlite3").verbose();

//Import Node's built-in path module.
//This allows us to safely create file paths across operting systems.
const path = require("path");

//Build the path to our SQLite database.
//_dirname is the directory containing this file (backend/)
//../database/payments.db is to move up one folder and enter the database/
const dbPath = path.join(
    __dirname,
    "../database/payments.db"
);

//Create a connection to the SQLite database.
//If the database file already exsists, SQLite will open it.
//If it does not exsist, SQLite will create it.
const db = new sqlite3.Database(dbPath, (err) => {

   //Check whether an error occurred while connecting.
    if (err) {

        //Log the error to the console.
        //This is a tool for QA troubleshooting.
        console.error("Database connection failed:", err.message);
    } else {

        //Confirm that the database connection is successful.
        //Log to the console.
        console.log("Connected to payments database.");
    }
});

//Exports the database connection.
//Backend files can require this file and use the same database connection.
module.exports = db;