# Payment Processing QA — Issues Report

## Project

**Application:** Financial Services Payment Center  
**Environment:** Local development environment  
**Application Type:** Demonstration payment-processing portal  
**Technology:** HTML, CSS, JavaScript, Node.js, Express, SQLite

---

## Issue Summary

| ID | Issue | Severity | Status |
|---|---|---|---|
| BUG-001 | Frontend JavaScript could not find payment elements | High | Resolved |
| BUG-002 | Frontend JavaScript could not find customer fields | High | Resolved |
| BUG-003 | Frontend HTML and JavaScript used inconsistent element IDs | High | Resolved |
| BUG-004 | Database file path was inconsistent | High | Resolved |

---

# BUG-001 — Payment Button Element Not Found

### Severity
**High**

### Status
**Resolved**

### Description

The payment submission functionality did not work because the JavaScript attempted to attach a click event listener to an element that did not exist in the HTML.

### Error

TypeError: null is not an object
(evaluating 'submitPayment.addEventListener')

---

# BUG-002 — Customer fields not populating

### Severity
**High**

### Status
**Resolved**

### Description

The customer lookup functionality failed because JavaScript could not locate the customer name input.

### Error

TypeError: null is not an object
(evaluating 'customerName.value')

---

# BUG-003 — HTML Javascript Element ID Mismatch

### Severity
**High**

### Status
**Resolved**

### Description

Multiple frontend elements used different IDs between the HTML and JavaScript.

### Expected IDs

The JavaScript expects:
customerName
customerCode
lookupButton
customerDetails
companyName
displayCode
accountNumber
displayContact
paymentSection
amount
submitPayment
paymentResult
resultContent

### Actual Problem

The previous HTML contained different elements including:
paymentForm
contactPerson
newContact
addContactButton
submitButton
result

Several elements expected by the JavaScript were therefore unavailable.

### Root Cause
An older version of the frontend remained in index.html while a newer version of script.js was being used.

### Resolution
The frontend was simplified and index.html was replaced with a version designed specifically for the current JavaScript functionality.

### Verification
The HTML and JavaScript now use matching element IDs.

---

### BUG-004 — Database File Path Inconsistency

### Severity
**High**

### Status
**Resolved**

### Description
The application initially referenced an inconsistent SQLite database filename/path.

### Expected Behavior
The backend should connect to:
database/payments.db

### Actual Problem
An older database file/path caused confusion about which database contained the current customer data.

### Root Cause
Multiple database filenames existed during development.

### Resolution
The project was standardized on:
database/payments.db
The database was recreated from:
database/schema.sql

### Verification
The customer records can be queried from the expected database and the API successfully returns customer information.