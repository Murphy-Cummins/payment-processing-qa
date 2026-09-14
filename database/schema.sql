DROP TABLE IF EXISTS Payments;
DROP TABLE IF EXISTS Customers;

CREATE TABLE Customers (
    CustomerID INTEGER PRIMARY KEY AUTOINCREMENT,
    CompanyName TEXT NOT NULL,
    AccountNumber TEXT NOT NULL,
    CustomerCode TEXT NOT NULL UNIQUE,
    ContactName TEXT NOT NULL
);

CREATE TABLE Payments (
    PaymentID INTEGER PRIMARY KEY AUTOINCREMENT,
    CustomerID INTEGER NOT NULL,
    CompanyName TEXT NOT NULL,
    ContactName TEXT NOT NULL,
    AccountNumber TEXT NOT NULL,
    Amount REAL NOT NULL,
    Status TEXT NOT NULL,
    PaymentDate TEXT NOT NULL,
    FOREIGN KEY (CustomerID)
        REFERENCES Customers(CustomerID)
);

INSERT INTO Customers
    (CompanyName, AccountNumber, CustomerCode, ContactName)
VALUES
    ('Blue Ridge Mortgage LLC', '10001', '472', 'John Smith'),
    ('Summit Financial Group', '10002', '819', 'Sarah Jones'),
    ('Riverstone Holdings', '10003', '263', 'Mike Brown'),
    ('Northstar Lending', '10004', '731', 'Gray Wilson'),
    ('Pinnacle Financial Services', '10005', '584', 'Emily Davis'),
    ('Cedar Valley Mortgage', '10006', '316', 'Chris Miller'),
    ('Horizon Capital Group', '10007', '925', 'Amanda Wilson'),
    ('Evergreen Financial LLC', '10008', '641', 'Daniel Moore'),
    ('Silver Oak Lending', '10009', '358', 'Jessica Taylor'),
    ('Westbridge Financial', '10010', '807', 'Matthew Anderson'),
    ('Lakeside Mortgage Group', '10011', '496', 'Rachel Adams'),
    ('Test Company', '10012', '336', 'Grayson Cummins');