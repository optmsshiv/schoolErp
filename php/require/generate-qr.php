<?php
require $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\LabelAlignment;

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

// Create a QR code
$qrCode = new QrCode($upi_uri);

// Set options for the QR code
$qrCode->setSize(300);
$qrCode->setMargin(10);
$qrCode->setErrorCorrectionLevel(ErrorCorrectionLevel::HIGH);

// Create a writer instance
$writer = new PngWriter();

// Generate the QR code image
$result = $writer->write($qrCode);

// Set headers and output image
header('Content-Type: image/png');
echo $result->getString();
?>
