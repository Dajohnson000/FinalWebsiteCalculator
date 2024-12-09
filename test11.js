document.addEventListener("DOMContentLoaded", function () {
    const loanAmountInput = document.getElementById("lamount");
    const interestRateInput = document.getElementById("irate");
    const loanTermInput = document.getElementById("lterm");
    const form = document.querySelector("form");
    const repaymentResult = document.getElementById("repayment");
    const interestResult = document.getElementById("interest");
    const paymentsResult = document.getElementById("payments");
    const ctx = document.getElementById("paymentChart").getContext("2d");

    form.addEventListener("submit", calculateLoanDetails);

    function calculateLoanDetails(event)
    {

        event.preventDefault(); // Prevent form submission

        // Get user input
        const loanAmount = parseFloat(loanAmountInput.value);
        const monthlyInterestRate = ((parseFloat(interestRateInput.value) / 100) / 12);
        const loanTerm = parseInt(loanTermInput.value, 10);

        // Clear previous error messages
        clearErrorMessages();

        // Validate inputs and show error messages
        let hasError = false;
        if (isNaN(loanAmount) || loanAmount <= 0)
        {
            showError(loanAmountInput, "Error: Invalid loan amount, please enter a positive number.");
            hasError = true;
        }

        if (isNaN(monthlyInterestRate) || monthlyInterestRate <= 0)
        {
            showError(interestRateInput, "Error: Invalid interest rate, please enter a positive percentage.");
            hasError = true;
        }

        if (isNaN(loanTerm) || loanTerm <= 0)
        {
            showError(loanTermInput, "Error: Invalid loan term, please enter a positive number of months.");
            hasError = true;
        }

        // If there are errors, stop execution
        if (hasError) return;

        // Total number of payments
        const totalPayments = loanTerm;

        // Monthly repayment calculation
        const monthlyRepayment =
            (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -totalPayments));

        // Total interest paid
        const totalPaid = monthlyRepayment * totalPayments;
        const totalInterest = totalPaid - loanAmount;

        // Update the results
        repaymentResult.textContent = `Repayment: $${monthlyRepayment.toFixed(2)}`;
        interestResult.textContent = `Total Interest: $${totalInterest.toFixed(2)}`;
        paymentsResult.textContent = `Total Payments: $${totalPaid.toFixed(2)}`;

        // Generate data for the graph
        const paymentData = generatePaymentData(loanAmount, monthlyInterestRate, totalPayments, monthlyRepayment);
        renderChart(ctx, paymentData.months, paymentData.interestPayments, paymentData.principalPayments);
    }

    function generatePaymentData(loanAmount, monthlyInterestRate, totalPayments, monthlyRepayment)
    {
        let remainingBalance = loanAmount;
        const months = [];
        const interestPayments = [];
        const principalPayments = [];

        for (let month = 1; month <= totalPayments; month++)
        {
            const interestPayment = remainingBalance * monthlyInterestRate;
            const principalPayment = monthlyRepayment - interestPayment;

            months.push(`Month ${month}`);
            interestPayments.push(interestPayment);
            principalPayments.push(principalPayment);

            remainingBalance -= principalPayment;
        }

        return { months, interestPayments, principalPayments };
    }

    function renderChart(ctx, months, interestPayments, principalPayments)
    {
        new Chart(ctx,
            {
            type: "bar", // Bar chart type
            data: {
                labels: months,
                datasets: [
                    {
                        label: "Interest Payment",
                        data: interestPayments,
                        backgroundColor: "rgba(255, 0, 0, 0.6)", // Red bars for interest
                        borderColor: "rgba(255, 0, 0, 1)",
                        borderWidth: 1,
                    },
                    {
                        label: "Principal Payment",
                        data: principalPayments,
                        backgroundColor: "rgba(0, 0, 255, 0.6)", // Blue bars for principal
                        borderColor: "rgba(0, 0, 255, 1)",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        mode: "index",
                        intersect: false,
                    },
                    legend: {
                        position: "top",
                    },
                },
                scales: {
                    x: {
                        stacked: true, // Stack bars
                        title: {
                            display: true,
                            text: "Months",
                        },
                    },
                    y: {
                        stacked: true, // Stack bars on y-axis
                        title: {
                            display: true,
                            text: "Payment Amount ($)",
                        },
                    },
                },
            },
        });
    }

    function showError(inputElement, message)
    {
        const error = document.createElement("span");
        error.className = "error-message";
        error.textContent = message;
        error.style.color = "red";
        error.style.marginLeft = "10px";

        // Append the error message next to the input field
        inputElement.parentNode.insertBefore(error, inputElement.nextSibling);
    }

    function clearErrorMessages()
    {
        const errors = document.querySelectorAll(".error-message");
        errors.forEach((error) => error.remove());
    }
});
