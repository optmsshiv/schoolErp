<?php
require $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\RoundBlockSizeMode;

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check if the class exists
if (!class_exists(QrCode::class)) {
    die("Error: Endroid QR Code library is NOT loaded!");
}

// Get the amount from the query parameter
$amount = isset($_GET['amount']) ? floatval($_GET['amount']) : 0;
$upi_id = "yourupi@upi";  // Replace with your actual UPI ID

if ($amount <= 0) {
    die("Invalid amount");
}

// Generate the UPI payment URI
$upi_uri = "upi://pay?pa=$upi_id&pn=School%20Fees&am=$amount&cu=INR";

// Create QR code using correct v6 syntax
$qrCode = QrCode::create($upi_uri)
    ->withEncoding(new Encoding('UTF-8'))
    ->withErrorCorrectionLevel(ErrorCorrectionLevel::High)
    ->withSize(300)
    ->withMargin(10)
    ->withRoundBlockSizeMode(RoundBlockSizeMode::Margin);

// Generate QR code image
$writer = new PngWriter();
$result = $writer->write($qrCode);

// Set headers and output image
header('Content-Type: image/png');
echo $result->getString();
?>
