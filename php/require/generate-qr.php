<?php

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require __DIR__ . '/../../vendor/autoload.php';

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\Writer\PngWriter;

// Get amount from URL
$amount = isset($_GET['amount']) ? floatval($_GET['amount']) : 0;
$upi_id = "yourupi@upi"; // Replace with your actual UPI ID

if ($amount <= 0) {
    die("Invalid amount specified.");
}

// UPI QR Code data
$upi_uri = "upi://pay?pa=" . urlencode($upi_id) . "&pn=" . urlencode("School Fees") . "&am=" . urlencode(number_format($amount, 2, '.', '')) . "&cu=INR";

// Generate QR Code
$qrCode = new QrCode(
    $upi_uri,
    new Encoding('UTF-8'),
    ErrorCorrectionLevel::High
);

$writer = new PngWriter();
$result = $writer->write($qrCode);

// Output QR code as PNG
header('Content-Type: ' . $result->getMimeType());
echo $result->getString();

?>
