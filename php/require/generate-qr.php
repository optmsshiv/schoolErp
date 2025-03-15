<?php
// Get the amount from the query parameter
$amount = isset($_GET['amount']) ? floatval($_GET['amount']) : 0;
$upi_id = "yourupi@upi";  // Replace with your actual UPI ID

if ($amount <= 0) {
    die("Invalid amount");
}

// Generate the UPI payment URI (properly encoded)
$upi_uri = rawurlencode("upi://pay?pa=$upi_id&pn=School%20Fees&am=$amount&cu=INR");

// Google Chart API QR Code URL
$qr_url = "https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=$upi_uri&choe=UTF-8";

// Output QR Code
echo "<img src='$qr_url' alt='UPI QR Code' />";
?>
