<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Get the amount from the query parameter
$amount = isset($_GET['amount']) ? floatval($_GET['amount']) : 0;

// Define UPI ID (fetch from database if dynamic per school)
$upi_id = "yourupi@upi";  // Replace with your actual UPI ID

if ($amount <= 0) {
    die("Invalid amount");
}

// Generate the UPI payment URI
$upi_uri = "upi://pay?pa=$upi_id&pn=School%20Fees&mc=0000&tid=123456&tr=ABC123&tn=Fee%20Payment&am=$amount&cu=INR";

// Create QR code
$qrCode = QrCode::create($upi_uri);
$writer = new PngWriter();
$result = $writer->write($qrCode);

// Output the QR code as a PNG image
header('Content-Type: image/png');
echo $result->getString();
