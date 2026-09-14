# Payment Processing QA — Test Cases

## Test Environment

**Application:** Financial Services Payment Center  
**Environment:** Local development  
**URL:** `http://localhost:3000`  
**Database:** SQLite  
**Browser:** Safari  
**Test Data:** Fictional customer data

---

# 1. Customer Verification Tests

## TC-001 — Valid Customer Verification

**Priority:** High  
**Type:** Functional  
**Status:** Not Run

### Preconditions

- Application is running.
- Customer `John Smith` exists in the database.
- Customer code is `472`.

### Steps

1. Open the payment portal.
2. Enter `John Smith` in the Name field.
3. Enter `472` in the Customer Code field.
4. Click **Find Account**.

### Expected Result

The customer is successfully verified.

The application displays:

- Company: `Blue Ridge Mortgage LLC`
- Customer Code: `472`
- Account Number: `10001`
- Contact: `John Smith`

---

## TC-002 — Valid Additional Customer

**Priority:** High  
**Type:** Functional  
**Status:** Not Run

### Steps

1. Enter `Rachel Adams`.
2. Enter customer code `496`.
3. Click **Find Account**.

### Expected Result

The application displays:

- Company: `Lakeside Mortgage Group`
- Customer Code: `496`
- Account Number: `10011`
- Contact: `Rachel Adams`

---

## TC-003 — Invalid Customer Code

**Priority:** High  
**Type:** Negative

### Steps

1. Enter a valid customer name.
2. Enter an incorrect three-digit customer code.
3. Click **Find Account**.

### Expected Result

The application rejects the lookup and displays an appropriate error.

No account information should be displayed.

---

## TC-004 — Invalid Customer Name

**Priority:** High  
**Type:** Negative

### Steps

1. Enter a name that does not exist.
2. Enter a valid customer code.
3. Click **Find Account**.

### Expected Result

The customer cannot be verified.

No account information should be displayed.

---

## TC-005 — Missing Customer Name

**Priority:** Medium  
**Type:** Negative

### Steps

1. Leave the Name field blank.
2. Enter `472`.
3. Click **Find Account**.

### Expected Result

The application displays:

```text
Please enter your name.