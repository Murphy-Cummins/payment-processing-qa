# Payment Processing QA — Troubleshooting Guide

## 1. Purpose

This guide provides a structured process for diagnosing common problems with the Financial Services Payment Center.

The troubleshooting approach is designed to isolate problems by application layer:

1. Browser / Frontend
2. API
3. Backend
4. Database
5. Integration

The goal is to identify the source of a problem before changing code.

---

# 2. Application Will Not Load

## Symptoms

- Browser displays an error.
- Page does not load.
- `localhost:3000` cannot be reached.

## Check

Verify that the Node.js server is running:

```bash
node backend/server.js