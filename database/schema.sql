CREATE TABLE Payments (
    PaymentID INTEGER PRIMARY KEY AUTOINCREMENT,
    CustomerName TEXT NOT NULL,
    AccountNumber TEXT NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    Status TEXT NOT NULL,
    PaymentDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Payments
(CustomerName, AccountNumber, Amount, Status)
Values
('John Smith', '10001', 250.00, 'Posted'),
('Sarah Jones', '10002', 150.00, 'Pending'),
('Mike Brown', '10003', 300.00, 'Failed');
