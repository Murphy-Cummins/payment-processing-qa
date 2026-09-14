const express = require("express");
const path = require("path");

const db = require("./database");

const app = express();

const PORT = process.env.PORT || 3000;



/*
========================================
MIDDLEWARE
========================================
*/

app.use(express.json());

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
CUSTOMER LOOKUP
========================================
*/

app.post("/api/lookup", (req, res) => {

    const name = req.body.name;
    const code = req.body.code;


    if (!name || !code) {

        return res.status(400).json({
            error: "Name and customer code are required."
        });

    }


    if (!/^\d{3}$/.test(code)) {

        return res.status(400).json({
            error: "Customer code must be 3 digits."
        });

    }


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


            if (!customer) {

                return res.status(404).json({
                    error:
                        "Customer name and code could not be verified."
                });

            }


            console.log(
                `[QA] Customer verified | ` +
                `${customer.CompanyName} | ` +
                `Contact: ${customer.ContactName} | ` +
                `Account: ${customer.AccountNumber}`
            );


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


    if (
        !Number.isInteger(customerID) ||
        customerID <= 0
    ) {

        return res.status(400).json({
            error: "Invalid customer."
        });

    }


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        return res.status(400).json({
            error: "Invalid payment amount."
        });

    }


    if (amount > 1000000) {

        return res.status(400).json({
            error:
                "Payment cannot exceed $1,000,000."
        });

    }


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