<?php
require $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';

use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Writer\PngWriter;

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Get the amount from the query parameter
$amount = isset($_GET['amount']) ? floatval($_GET['amount']) : 0;
$upi_id = "yourupi@upi";  // Replace with your actual UPI ID

if ($amount <= 0) {
    die("Invalid amount");
}

// Generate the UPI payment URI
$upi_uri = "upi://pay?pa=$upi_id&pn=School%20Fees&am=$amount&cu=INR";

// ✅ Correct way for Endroid QR Code v6.0.5 (without create())
$result = (new Builder())
    ->writer(new PngWriter())
    ->data($upi_uri)
    ->size(300)
    ->margin(10)
    ->build();

// Set headers and output image
header('Content-Type: image/png');
echo $result->getString();
?>
