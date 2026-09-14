/*
Wait until the HTML document has completed loaded before attempting 
to access the elements.
*/

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /*
        ========================================
        GET HTML ELEMENTS
        ========================================
        */

        /*
        User entered information
        */

        const testCustomers =
            document.getElementById(
                "testCustomers"
            );

        const customerName =
            document.getElementById(
                "customerName"
            );

        const customerCode =
            document.getElementById(
                "customerCode"
            );

        const lookupButton =
            document.getElementById(
                "lookupButton"
            );

        const lookupError =
            document.getElementById(
                "lookupError"
            );

        const customerDetails =
            document.getElementById(
                "customerDetails"
            );

        const companyName =
            document.getElementById(
                "companyName"
            );

        const displayCode =
            document.getElementById(
                "displayCode"
            );

        const accountNumber =
            document.getElementById(
                "accountNumber"
            );

        const displayContact =
            document.getElementById(
                "displayContact"
            );

        const paymentSection =
            document.getElementById(
                "paymentSection"
            );

        const amount =
            document.getElementById(
                "amount"
            );

        const submitPayment =
            document.getElementById(
                "submitPayment"
            );

        const paymentError =
            document.getElementById(
                "paymentError"
            );

        const paymentResult =
            document.getElementById(
                "paymentResult"
            );

        const resultContent =
            document.getElementById(
                "resultContent"
            );



        /*
        ========================================
        CURRENT CUSTOMER
        ========================================
        */

        let currentCustomerID = null;



        /*
        ========================================
        LOAD RANDOM TEST CUSTOMERS
        ========================================
        */

        function loadTestCustomers() {

            fetch("./api/test-customers")

                .then(response => {

                    if (!response.ok) {

                        throw new Error(
                            "Unable to load test customers."
                        );

                    }

                    return response.json();

                })

                .then(data => {

                    testCustomers.innerHTML = "";


                    data.customers.forEach(
                        customer => {

                            const customerCard =
                                document.createElement(
                                    "div"
                                );

                            customerCard.className =
                                "test-customer";


                            customerCard.innerHTML = `

                                <strong>
                                    ${customer.ContactName}
                                </strong>

                                <span>
                                    ${customer.CompanyName}
                                </span>

                                <small>
                                    Customer Code:
                                    <b>${customer.CustomerCode}</b>
                                </small>

                                <button
                                    type="button"
                                    class="use-customer"
                                >
                                    Use This Customer
                                </button>

                            `;


                            const useButton =
                                customerCard.querySelector(
                                    ".use-customer"
                                );


                            useButton.addEventListener(
                                "click",
                                () => {

                                    customerName.value =
                                        customer.ContactName;

                                    customerCode.value =
                                        customer.CustomerCode;


                                    lookupError.textContent =
                                        "";


                                    // Put the cursor in
                                    // the Verify button.
                                    lookupButton.focus();

                                }
                            );


                            testCustomers.appendChild(
                                customerCard
                            );

                        }
                    );

                })

                .catch(error => {

                    console.error(
                        "[QA] Test customer loading error:",
                        error
                    );


                    testCustomers.innerHTML = `
                        <p class="error">
                            Test customers could not be loaded.
                        </p>
                    `;

                });

        }



        /*
        ========================================
        CUSTOMER LOOKUP
        ========================================
        */

        lookupButton.addEventListener(
            "click",
            () => {

                lookupError.textContent = "";


                const name =
                    customerName.value.trim();

                const code =
                    customerCode.value.trim();


                // Validate name.
                if (!name) {

                    lookupError.textContent =
                        "Please enter your name.";

                    return;

                }


                // Validate three-digit code.
                if (!/^\d{3}$/.test(code)) {

                    lookupError.textContent =
                        "Customer code must be exactly 3 digits.";

                    return;

                }


                lookupButton.disabled = true;

                lookupButton.textContent =
                    "Verifying...";


                fetch("./api/lookup", {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        name: name,

                        code: code

                    })

                })

                    .then(response => {

                        return response.json()
                            .then(data => ({

                                ok:
                                    response.ok,

                                data:
                                    data

                            }));

                    })

                    .then(result => {

                        if (!result.ok) {

                            throw new Error(
                                result.data.error ||
                                "Customer verification failed."
                            );

                        }


                        const customer =
                            result.data.customer;


                        /*
                        Store only the database
                        customer ID.

                        The server will look up the
                        account number itself when
                        the payment is submitted.
                        */

                        currentCustomerID =
                            customer.CustomerID;


                        companyName.textContent =
                            customer.CompanyName;

                        displayCode.textContent =
                            customer.CustomerCode;

                        accountNumber.textContent =
                            customer.AccountNumber;

                        displayContact.textContent =
                            customer.ContactName;


                        customerDetails.classList.remove(
                            "hidden"
                        );

                        paymentSection.classList.remove(
                            "hidden"
                        );


                        console.log(
                            `[QA] Customer verified | ` +
                            `${customer.CompanyName} | ` +
                            `Contact: ${customer.ContactName} | ` +
                            `Account: ${customer.AccountNumber}`
                        );

                    })

                    .catch(error => {

                        lookupError.textContent =
                            error.message;

                        customerDetails.classList.add(
                            "hidden"
                        );

                        paymentSection.classList.add(
                            "hidden"
                        );

                        currentCustomerID = null;

                    })

                    .finally(() => {

                        lookupButton.disabled = false;

                        lookupButton.textContent =
                            "Verify Customer";

                    });

            }
        );



        /*
        ========================================
        PAYMENT SUBMISSION
        ========================================
        */

        submitPayment.addEventListener(
            "click",
            () => {

                paymentError.textContent = "";


                if (!currentCustomerID) {

                    paymentError.textContent =
                        "Please verify a customer first.";

                    return;

                }


                const paymentAmount =
                    Number(amount.value);


                // Validate payment amount.
                if (
                    !Number.isFinite(paymentAmount) ||
                    paymentAmount <= 0
                ) {

                    paymentError.textContent =
                        "Please enter a valid payment amount.";

                    return;

                }


                // Client-side maximum.
                if (paymentAmount > 1000000) {

                    paymentError.textContent =
                        "Payment cannot exceed $1,000,000.";

                    return;

                }


                submitPayment.disabled = true;

                submitPayment.textContent =
                    "Processing...";


                fetch("./api/payment", {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        customerID:
                            currentCustomerID,

                        amount:
                            paymentAmount

                    })

                })

                    .then(response => {

                        return response.json()
                            .then(data => ({

                                ok:
                                    response.ok,

                                data:
                                    data

                            }));

                    })

                    .then(result => {

                        if (!result.ok) {

                            throw new Error(
                                result.data.error ||
                                "Payment could not be processed."
                            );

                        }


                        const payment =
                            result.data.payment;


                        /*
                        Display the result.
                        */

                        resultContent.innerHTML = `

                            <div class="payment-summary">

                                <p>
                                    <strong>Company:</strong>
                                    ${payment.CompanyName}
                                </p>

                                <p>
                                    <strong>Account:</strong>
                                    ${payment.AccountNumber}
                                </p>

                                <p>
                                    <strong>Amount:</strong>
                                    $${payment.Amount.toFixed(2)}
                                </p>

                                <p>
                                    <strong>Status:</strong>
                                    ${payment.Status}
                                </p>

                            </div>

                        `;


                        paymentResult.classList.remove(
                            "hidden"
                        );


                        /*
                        QA console log.
                        */

                        console.log(
                            `[QA] Payment ${payment.PaymentID} | ` +
                            `${payment.CompanyName} | ` +
                            `Contact: ${payment.ContactName} | ` +
                            `Account: ${payment.AccountNumber} | ` +
                            `Amount: $${payment.Amount.toFixed(2)} | ` +
                            `Status: ${payment.Status.toUpperCase()}`
                        );


                        // Clear payment amount.
                        amount.value = "";

                    })

                    .catch(error => {

                        paymentError.textContent =
                            error.message;

                    })

                    .finally(() => {

                        submitPayment.disabled = false;

                        submitPayment.textContent =
                            "Submit Payment";

                    });

            }
        );



        /*
        ========================================
        INITIALIZE PAGE
        ========================================
        */

        console.log(
            "[QA] Payment portal loaded."
        );


        loadTestCustomers();

    }
);