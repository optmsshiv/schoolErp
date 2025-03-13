<?php
require $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\RoundBlockSizeMode;
use Endroid\QrCode\Writer\Result\PngResult;

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check if the class exists
if (!class_exists('Endroid\QrCode\QrCode')) {
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
$qrCode = new QrCode($upi_uri);
$qrCode->setEncoding(new Encoding('UTF-8'));
$qrCode->setErrorCorrectionLevel(ErrorCorrectionLevel::High);
$qrCode->setSize(300);
$qrCode->setMargin(10);
$qrCode->setRoundBlockSizeMode(RoundBlockSizeMode::Margin);

// Generate QR code image
$writer = new PngWriter();
$result = $writer->write($qrCode);

/** @var PngResult $result */
header('Content-Type: image/png');
echo $result->getString();
?>
