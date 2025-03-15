<?php

// Set the content type to PNG (MUST be set before outputting anything)
header('Content-Type: image/png');
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Sat, 1 Jan 2000 00:00:00 GMT");

// Enable error reporting for debugging (Remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Get the amount from the query parameter & sanitize it
$amount = isset($_GET['amount']) ? filter_var($_GET['amount'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION) : 0;
$amount = floatval($amount);

// Replace with your actual UPI ID (Consider fetching from DB)
$upi_id = "yourupi@upi";

if ($amount <= 0) {
    die("Invalid amount specified.");
}

// Encode UPI payment URI
$upi_uri = "upi://pay?pa=" . urlencode($upi_id) . "&pn=" . urlencode("School Fees") . "&am=" . urlencode($amount) . "&cu=INR";

// Use QuickChart.io to generate QR
$quickchart_qr_url = "https://quickchart.io/qr?text=" . urlencode($upi_uri) . "&size=300";

// Fetch QR code image directly
$qr_image = file_get_contents($quickchart_qr_url);

if (!$qr_image) {
    die("Failed to generate QR Code.");
}

// Output the image data
echo $qr_image;

?>
