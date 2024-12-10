document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loanForm');
    const lamount = document.getElementById('lamount');
    const irate = document.getElementById('irate');
    const lterm = document.getElementById('lterm');
    const repaymentResult = document.getElementById('repayment');
    const interestResult = document.getElementById('interest');
    const paymentsResult = document.getElementById('payments');
    const chartCanvas = document.getElementById('paymentChart');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Client-side validation
        let loanAmount = parseFloat(lamount.value);
        let interest = parseFloat(irate.value);
        let term = parseInt(lterm.value);

        if (isNaN(loanAmount) || loanAmount <= 0) {
            alert("Please enter a valid positive loan amount");
            return;
        }
        if (isNaN(interest) || interest <= 0) {
            alert("Please enter a valid positive interest rate");
            return;
        }
        if (isNaN(term) || term <= 0) {
            alert("Please enter a valid positive loan term (in months)");
            return;
        }

        // Send AJAX request to process_loan.php
        fetch('process_loan.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `lamount=${loanAmount}&irate=${interest}&lterm=${term}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                repaymentResult.textContent = "Monthly Repayment: $" + data.monthlyPayment;
                interestResult.textContent = "Total Interest: $" + data.totalInterest;
                paymentsResult.textContent = "Total Payments: $" + data.totalPayment;

            }
        })
        .catch(error => console.error(error));
    });
});