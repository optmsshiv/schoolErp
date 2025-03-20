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
use Endroid\QrCode\Label\Label;
use Endroid\QrCode\Logo\Logo;

// Get amount from URL
$amount = isset($_GET['amount']) ? floatval($_GET['amount']) : 0;
$upi_id = "yourupi@upi"; // Replace with your actual UPI ID

if ($amount <= 0) {
    die("Invalid amount specified.");
}

// UPI QR Code data
$upi_uri = "upi://pay?pa=" . urlencode($upi_id) . "&pn=" . urlencode("School Fees") . "&am=" . urlencode(number_format($amount, 2, '.', '')) . "&cu=INR";

// Create QR Code
$qrCode = QrCode::create($upi_uri)
    ->setEncoding(new Encoding('UTF-8'))
    ->setErrorCorrectionLevel(ErrorCorrectionLevel::High)
    ->setSize(300)
    ->setMargin(10);

// Add logo if available
$logoPath = __DIR__ . '/logo.png'; // Ensure logo.png is present in the same directory
if (file_exists($logoPath)) {
    $logo = Logo::fromPath($logoPath)->setResizeToWidth(60);
} else {
    $logo = null;
}

// Add label
$label = Label::create('Scan to Pay ₹' . number_format($amount, 2, '.', '') . ' INR')
    ->setFontSize(16);

// Generate the QR code with PNG writer
$writer = new PngWriter();
$result = $writer->write($qrCode, $logo, $label);

// Output QR code as PNG
header('Content-Type: ' . $result->getMimeType());
echo $result->getString();

?>
