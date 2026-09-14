document.addEventListener(
    "DOMContentLoaded",
    function () {


        console.log(
            "[QA] Payment portal loaded."
        );


        // =====================================
        // GET ELEMENTS
        // =====================================

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

        const paymentResult =
            document.getElementById(
                "paymentResult"
            );

        const resultContent =
            document.getElementById(
                "resultContent"
            );


        // =====================================
        // CURRENT CUSTOMER
        // =====================================

        let currentCustomerID = null;


        // =====================================
        // FIND ACCOUNT
        // =====================================

        lookupButton.addEventListener(
            "click",
            function () {

                const name =
                    customerName.value.trim();

                const code =
                    customerCode.value.trim();


                console.log(
                    "[QA] Looking up customer:",
                    name,
                    code
                );


                // Check name

                if (!name) {

                    alert(
                        "Please enter your name."
                    );

                    return;
                }


                // Check customer code

                if (!/^\d{3}$/.test(code)) {

                    alert(
                        "Customer code must be exactly 3 digits."
                    );

                    return;
                }


                lookupButton.disabled = true;

                lookupButton.textContent =
                    "Finding Account...";


                fetch(
                    "./api/lookup",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            name: name,

                            code: code

                        })
                    }
                )

                .then(
                    function (response) {

                        return response.json()
                            .then(
                                function (data) {

                                    if (
                                        !response.ok
                                    ) {

                                        throw new Error(
                                            data.error
                                        );

                                    }

                                    return data;

                                }
                            );

                    }
                )

                .then(
                    function (data) {

                        const customer =
                            data.customer;


                        currentCustomerID =
                            customer.CustomerID;


                        // Populate account

                        companyName.textContent =
                            customer.CompanyName;

                        displayCode.textContent =
                            customer.CustomerCode;

                        accountNumber.textContent =
                            customer.AccountNumber;

                        displayContact.textContent =
                            customer.ContactName;


                        // Show sections

                        customerDetails
                            .classList
                            .remove("hidden");

                        paymentSection
                            .classList
                            .remove("hidden");


                        console.log(
                            "[QA] Customer verified."
                        );

                    }
                )

                .catch(
                    function (error) {

                        console.error(
                            "[QA] Lookup error:",
                            error
                        );

                        alert(
                            error.message
                        );

                    }
                )

                .finally(
                    function () {

                        lookupButton.disabled =
                            false;

                        lookupButton.textContent =
                            "Find Account";

                    }
                );

            }
        );


        // =====================================
        // SUBMIT PAYMENT
        // =====================================

        submitPayment.addEventListener(
            "click",
            function () {

                const paymentAmount =
                    Number(
                        amount.value
                    );


                if (!currentCustomerID) {

                    alert(
                        "Please verify your account first."
                    );

                    return;
                }


                if (
                    !Number.isFinite(
                        paymentAmount
                    ) ||
                    paymentAmount <= 0
                ) {

                    alert(
                        "Please enter a valid payment amount."
                    );

                    return;
                }


                submitPayment.disabled =
                    true;

                submitPayment.textContent =
                    "Processing...";


                fetch(
                    "./api/payment",
                    {

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
                    }
                )

                .then(
                    function (response) {

                        return response.json()
                            .then(
                                function (data) {

                                    if (
                                        !response.ok
                                    ) {

                                        throw new Error(
                                            data.error
                                        );

                                    }

                                    return data;

                                }
                            );

                    }
                )

                .then(
                    function (data) {

                        const payment =
                            data.payment;


                        resultContent.innerHTML = `

                            <div class="result-row">
                                <span>Company</span>
                                <strong>
                                    ${payment.CompanyName}
                                </strong>
                            </div>

                            <div class="result-row">
                                <span>Account</span>
                                <strong>
                                    ${payment.AccountNumber}
                                </strong>
                            </div>

                            <div class="result-row">
                                <span>Amount</span>
                                <strong>
                                    $${Number(
                                        payment.Amount
                                    ).toFixed(2)}
                                </strong>
                            </div>

                            <div class="result-row">
                                <span>Status</span>
                                <strong>
                                    ${payment.Status}
                                </strong>
                            </div>

                        `;


                        paymentResult
                            .classList
                            .remove("hidden");


                        console.log(
                            `[QA] Payment ${payment.PaymentID} | ` +
                            `${payment.CompanyName} | ` +
                            `Contact: ${payment.ContactName} | ` +
                            `Account: ${payment.AccountNumber} | ` +
                            `Amount: $${Number(
                                payment.Amount
                            ).toFixed(2)} | ` +
                            `Status: ${payment.Status.toUpperCase()}`
                        );


                        amount.value = "";

                    }
                )

                .catch(
                    function (error) {

                        console.error(
                            "[QA] Payment error:",
                            error
                        );

                        alert(
                            error.message
                        );

                    }
                )

                .finally(
                    function () {

                        submitPayment.disabled =
                            false;

                        submitPayment.textContent =
                            "Submit Payment";

                    }
                );

            }
        );

    }
);