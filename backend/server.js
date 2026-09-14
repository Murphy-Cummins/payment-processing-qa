//
// IMPORT DEPENDENCIES
//

const express = require("express");
const path = require("path");
const db = require("./database");


// Create Express application.
const app = express();


// Use the PORT provided by the hosting environment.
// Use 3000 when running locally.
const PORT = process.env.PORT || 3000;



/*
========================================
MIDDLEWARE
========================================
*/

// Allow Express to read JSON request bodies.
app.use(express.json());


// Serve the frontend files.
app.use(
    express.static(
        path.join(__dirname, "../frontend")
    )
);



/*
========================================
HOME PAGE
========================================
*/

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../frontend/index.html"
        )
    );

});



/*
========================================
RANDOM TEST CUSTOMERS
========================================
*/

// Return three random fictional customers
// from the Customers database table.
//
// This endpoint is used by the frontend to
// display convenient test customers.
app.get("/api/test-customers", (req, res) => {

    const sql = `
        SELECT
            CompanyName,
            ContactName,
            CustomerCode
        FROM Customers
        ORDER BY RANDOM()
        LIMIT 3
    `;


    db.all(sql, [], (err, customers) => {

        if (err) {

            console.error(
                "Test customer lookup error:",
                err.message
            );

            return res.status(500).json({
                error: "Unable to load test customers."
            });

        }


        res.json({
            customers: customers
        });

    });

});



/*
========================================
CUSTOMER LOOKUP
========================================
*/

app.post("/api/lookup", (req, res) => {

    const name = req.body.name;
    const code = req.body.code;


    // Make sure both values were provided.
    if (!name || !code) {

        return res.status(400).json({
            error: "Name and customer code are required."
        });

    }


    // Customer code must contain exactly three digits.
    if (!/^\d{3}$/.test(code)) {

        return res.status(400).json({
            error: "Customer code must be 3 digits."
        });

    }


    // Use parameterized SQL so user input
    // is never directly inserted into SQL.
    const sql = `
        SELECT
            CustomerID,
            CompanyName,
            AccountNumber,
            CustomerCode,
            ContactName
        FROM Customers
        WHERE CustomerCode = ?
        AND LOWER(ContactName) = LOWER(?)
    `;


    db.get(
        sql,
        [code, name.trim()],
        (err, customer) => {

            if (err) {

                console.error(
                    "Database lookup error:",
                    err.message
                );

                return res.status(500).json({
                    error: "Database error."
                });

            }


            // No matching customer.
            if (!customer) {

                return res.status(404).json({
                    error:
                        "Customer name and code could not be verified."
                });

            }


            // QA console message.
            console.log(
                `[QA] Customer verified | ` +
                `${customer.CompanyName} | ` +
                `Contact: ${customer.ContactName} | ` +
                `Account: ${customer.AccountNumber}`
            );


            // Return verified customer information.
            res.json({
                customer: customer
            });

        }
    );

});



/*
========================================
SUBMIT PAYMENT
========================================
*/

app.post("/api/payment", (req, res) => {

    const customerID =
        Number(req.body.customerID);

    const amount =
        Number(req.body.amount);


    // Validate customer ID.
    if (
        !Number.isInteger(customerID) ||
        customerID <= 0
    ) {

        return res.status(400).json({
            error: "Invalid customer."
        });

    }


    // Validate payment amount.
    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        return res.status(400).json({
            error: "Invalid payment amount."
        });

    }


    // Maximum payment amount.
    if (amount > 1000000) {

        return res.status(400).json({
            error:
                "Payment cannot exceed $1,000,000."
        });

    }


    // Look up the customer on the server.
    //
    // The browser's account number is NEVER trusted.
    const sql = `
        SELECT
            CustomerID,
            CompanyName,
            AccountNumber,
            CustomerCode,
            ContactName
        FROM Customers
        WHERE CustomerID = ?
    `;


    db.get(
        sql,
        [customerID],
        (err, customer) => {

            if (err) {

                console.error(
                    "Database payment lookup error:",
                    err.message
                );

                return res.status(500).json({
                    error: "Database error."
                });

            }


            if (!customer) {

                return res.status(404).json({
                    error: "Customer not found."
                });

            }


            // Random demonstration payment status.
            const statuses = [
                "Posted",
                "Pending",
                "Failed"
            ];


            const status =
                statuses[
                    Math.floor(
                        Math.random() *
                        statuses.length
                    )
                ];


            // Insert payment into database.
            const insertSQL = `
                INSERT INTO Payments
                (
                    CustomerID,
                    CompanyName,
                    ContactName,
                    AccountNumber,
                    Amount,
                    Status,
                    PaymentDate
                )
                VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
            `;


            db.run(
                insertSQL,

                [
                    customer.CustomerID,
                    customer.CompanyName,
                    customer.ContactName,
                    customer.AccountNumber,
                    amount,
                    status
                ],

                function (insertErr) {

                    if (insertErr) {

                        console.error(
                            "Payment insert error:",
                            insertErr.message
                        );

                        return res.status(500).json({
                            error:
                                "Unable to save payment."
                        });

                    }


                    // QA troubleshooting log.
                    console.log(
                        `[QA] Payment ${this.lastID} | ` +
                        `${customer.CompanyName} | ` +
                        `Contact: ${customer.ContactName} | ` +
                        `Account: ${customer.AccountNumber} | ` +
                        `Amount: $${amount.toFixed(2)} | ` +
                        `Status: ${status.toUpperCase()}`
                    );


                    res.json({

                        payment: {

                            PaymentID:
                                this.lastID,

                            CompanyName:
                                customer.CompanyName,

                            ContactName:
                                customer.ContactName,

                            AccountNumber:
                                customer.AccountNumber,

                            Amount:
                                amount,

                            Status:
                                status

                        }

                    });

                }
            );

        }
    );

});



/*
========================================
START SERVER
========================================
*/

app.listen(PORT, "0.0.0.0", () => {

    console.log(
        `Payment Processing app running on port ${PORT}`
    );

});