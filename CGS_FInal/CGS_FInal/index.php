<?php
session_start();
?>
<!DOCTYPE html>
<html>
<head>
    <title>Student Loan Calculator</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
<header>
    <h1>Student Loan Calculator</h1>
</header>

<?php if (isset($_SESSION['username'])): ?>
    <p>Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?>! <a href="logout.php">Logout</a></p>
<?php else: ?>
    <p><a href="login.php">Login</a> | <a href="register.php">Register</a></p>
<?php endif; ?>

<div id="input">
    <form id="loanForm">
        <h3><u>Your Loan Information</u></h3>
        <label for="lamount">Loan Amount
            <a href="https://studentaid.gov" target="_blank">
                <img id="help" src="images/help.png" alt="Help">
            </a>
        </label><br>
        <input type="text" id="lamount" name="lamount"><br><br>

        <label for="irate">Interest Rate (In Percent)
            <a href="https://studentaid.gov/help-center/answers/article/what-interest-rate-will-i-pay-on-federal-loans" target="_blank">
                <img id="help" src="images/help.png" alt="Help">
            </a>
        </label><br>
        <input type="text" id="irate" name="irate"><br><br>

        <label for="lterm">Loan Term (In Months)
            <a href="https://www.sofi.com/learn/content/average-payoff-time-for-student-loans" target="_blank">
                <img id="help" src="images/help.png" alt="Help">
            </a>
        </label><br>
        <input type="text" id="lterm" name="lterm"><br><br>

        <input type="submit" value="Calculate" id="Calculate">
    </form>
</div>

<div id="results">
    <h3><u>Your Payment</u></h3>
    <p id="repayment">Monthly Repayment:</p>
    <p id="interest">Total Interest:</p>
    <p id="payments">Total Payments:</p>
    <canvas id="paymentChart"></canvas>
</div>

<?php if (isset($_SESSION['user_id'])): ?>
    <h3>Your Previous Calculations:</h3>
    <?php
    require_once 'private/db_connect.php';
    $stmt = $conn->prepare("SELECT loan_amount, interest_rate, loan_term, monthly_payment, total_payment, total_interest, created_at 
                            FROM loans WHERE user_id = ? ORDER BY created_at DESC LIMIT 5");
    $stmt->bind_param("i", $_SESSION['user_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0):
    ?>
    <table border="1">
        <tr>
            <th>Loan Amount</th>
            <th>Interest Rate (%)</th>
            <th>Loan Term (months)</th>
            <th>Monthly Payment</th>
            <th>Total Payment</th>
            <th>Total Interest</th>
            <th>Calculated At</th>
        </tr>
        <?php while ($row = $result->fetch_assoc()): ?>
        <tr>
            <td><?php echo htmlspecialchars($row['loan_amount']); ?></td>
            <td><?php echo htmlspecialchars($row['interest_rate']); ?></td>
            <td><?php echo htmlspecialchars($row['loan_term']); ?></td>
            <td><?php echo htmlspecialchars($row['monthly_payment']); ?></td>
            <td><?php echo htmlspecialchars($row['total_payment']); ?></td>
            <td><?php echo htmlspecialchars($row['total_interest']); ?></td>
            <td><?php echo htmlspecialchars($row['created_at']); ?></td>
        </tr>
        <?php endwhile; ?>
    </table>
    <?php else: ?>
        <p>No previous calculations found.</p>
    <?php endif; ?>
<?php endif; ?>

<script src="script.js"></script>
</body>
</html>