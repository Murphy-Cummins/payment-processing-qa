# Payment Processing QA Test Plan

## 1. Document Information

**Project:** Financial Services Payment Center  
**Document:** QA Test Plan  
**Application Type:** Demonstration payment-processing portal  
**Environment:** Local development environment  
**Technology:** HTML, CSS, JavaScript, Node.js, Express, SQLite

---

# 2. Test Objective

The purpose of this test plan is to verify that the Financial Services Payment Center correctly:

- Verifies customers using their name and three-digit customer code.
- Retrieves the correct company and account information.
- Displays verified customer information.
- Accepts valid payment amounts.
- Rejects invalid payment amounts.
- Creates payment records in the database.
- Assigns a payment status of Posted, Pending, or Failed.
- Prevents unauthorized or invalid customer lookups.
- Handles invalid requests without exposing sensitive information.
- Provides useful information for QA troubleshooting.

The application is a demonstration system and does not process real payments or collect real financial information.

---

# 3. Scope

## In Scope

### Customer Verification

- Customer name validation
- Customer code validation
- Three-digit customer code requirement
- Customer lookup
- Matching customer name and code
- Display of company name
- Display of customer code
- Display of account number
- Display of contact name

### Payment Processing

- Payment amount validation
- Minimum payment validation
- Maximum payment validation
- Payment submission
- Payment database insertion
- Random payment status assignment
- Payment result display

### Database

- Customer records
- Customer code uniqueness
- Account number retrieval
- Payment records
- Database relationships

### Error Handling

- Missing customer information
- Invalid customer codes
- Invalid customer credentials
- Invalid payment amounts
- Invalid customer IDs
- Database errors
- Payment insertion errors

### QA Troubleshooting

- Browser-side JavaScript errors
- API testing
- Database verification
- Server troubleshooting
- Application integration testing

---

# 4. Out of Scope

The following are not tested because this is a demonstration application:

- Real payment processing
- Real banking transactions
- Credit card processing
- ACH processing
- Production financial data
- Real customer authentication
- Production deployment
- Third-party payment processors
- Production load testing
- Production penetration testing
- Mobile application testing

---

# 5. Test Environment

## Software

- macOS
- Node.js
- Express
- SQLite
- Web browser
- VS Code
- Git/GitHub
- Terminal

## Application

The application runs locally using:

```text
http://localhost:3000