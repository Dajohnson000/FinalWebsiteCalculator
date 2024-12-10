<?php
session_start();
require_once 'private/db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $lamount = floatval($_POST['lamount']);
    $irate = floatval($_POST['irate']);
    $lterm = intval($_POST['lterm']);

    // Server-side validation
    if ($lamount <= 0 || $irate <= 0 || $lterm <= 0) {
        echo json_encode(["error" => "Please enter valid positive values."]);
        exit;
    }

    $monthlyInterestRate = ($irate / 100) / 12;
    $monthlyPayment = ($lamount * $monthlyInterestRate) / (1 - pow(1 + $monthlyInterestRate, - $lterm));
    $totalPayment = $monthlyPayment * $lterm;
    $totalInterest = $totalPayment - $lamount;

    // If user is logged in, store the result in the database
    if (isset($_SESSION['user_id'])) {
        $stmt = $conn->prepare("INSERT INTO loans (user_id, loan_amount, interest_rate, loan_term, monthly_payment, total_payment, total_interest)
                                VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("iddiddd", $_SESSION['user_id'], $lamount, $irate, $lterm, $monthlyPayment, $totalPayment, $totalInterest);
        $stmt->execute();
    }

    echo json_encode([
        "monthlyPayment" => number_format($monthlyPayment, 2),
        "totalPayment" => number_format($totalPayment, 2),
        "totalInterest" => number_format($totalInterest, 2)
    ]);
}