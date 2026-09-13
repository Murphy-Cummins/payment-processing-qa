const db = require('./database');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS Payments (
            PaymentID INTEGER PRIMARY KEY AUTOINCREMENT,
            CustomerName TEXT NOT NULL,
            AccountNumber TEXT NOT NULL,
            Amount DECIMAL(10,2) NOT NULL,
            Status TEXT NOT NULL,
            PaymentDate DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Payments table created successfully.');
        }
    });

    db.run(`
        INSERT INTO Payments
        (CustomerName, AccountNumber, Amount, Status)
        VALUES (?, ?, ?, ?)
    `,
    ['John Smith', '10001', 250.00, 'Posted'],
    (err) => {
        if (err) {
            console.error('Error inserting payment:', err.message);
        } else {
            console.log('Test payment added successfully.');
        }
    });

    // Retrieve all payments
    db.all(`
        SELECT *
        FROM Payments
    `, (err, rows) => {
        if (err) {
            console.error('Error retrieving payments:', err.message);
        } else {
            console.log('Payments:');
            console.table(rows);
        }
    });
});

db.close((err) => {
    if (err) {
        console.error('Error closing database:', err.message);
    } else {
        console.log('Database connection closed.');
    }
});