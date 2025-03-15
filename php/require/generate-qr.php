<?php

header('Content-Type: image/png');
// Enable error reporting for debugging (Remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Get the amount from the query parameter & sanitize it
$amount = isset($_GET['amount']) ? filter_var($_GET['amount'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION) : 0;
$amount = floatval($amount);

// Replace with your actual UPI ID (Consider fetching from DB)b..
$upi_id = "yourupi@upi";

if ($amount <= 0) {
    die("Invalid amount specified.");
}

// Encode UPI payment URI
$upi_uri = "upi://pay?pa=" . urlencode($upi_id) . "&pn=" . urlencode("School Fees") . "&am=" . urlencode($amount) . "&cu=INR";

// Google API QR Code URL
$google_qr_url = "https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=" . urlencode($upi_uri) . "&choe=UTF-8";

// Backup QR Code using QuickChart.io (More Reliable)
$quickchart_qr_url = "https://quickchart.io/qr?text=" . urlencode($upi_uri) . "&size=300";

// Use Google API first, fallback to QuickChart.io if needed
$final_qr_url = @file_get_contents($google_qr_url) ? $google_qr_url : $quickchart_qr_url;

// Output QR Code
echo "<p>Scan this QR code to pay ₹$amount</p>";
echo "<img src='" . htmlspecialchars($final_qr_url, ENT_QUOTES, 'UTF-8') . "' alt='UPI QR Code' />";
?>
