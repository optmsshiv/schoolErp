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
use Endroid\QrCode\Color\Color;
use Endroid\QrCode\Label\Font\NotoSans; // Ensure this font is available

// Get amount from URL
$amount = isset($_GET['amount']) ? floatval($_GET['amount']) : 0;
$upi_id = "yourupi@upi"; // Replace with your actual UPI ID

if ($amount <= 0) {
    die("Invalid amount specified.");
}

// UPI QR Code data
$upi_uri = "upi://pay?pa=" . urlencode($upi_id) . "&pn=" . urlencode("School Fees") . "&am=" . urlencode(number_format($amount, 2, '.', '')) . "&cu=INR";

// Create QR code
$qrCode = new QrCode(
    data: $upi_uri,
    encoding: new Encoding('UTF-8'),
    errorCorrectionLevel: ErrorCorrectionLevel::High
);

// Add logo (if file exists)
$logoPath = __DIR__ . '/logo.png'; // Ensure logo.png exists
$logo = file_exists($logoPath) ? new Logo($logoPath, 60) : null;

// Use a font that supports ₹ symbol
$fontPath = __DIR__ . '/php/require/NotoSans.ttf';
 // Ensure this font is available in the directory

if (file_exists($fontPath)) {
    $font = new NotoSans($fontPath, 14);
} else {
    die("Font file not found:" . $fontPath);
}

// Add label with correct font
$label = new Label(
    text: "Pay ₹" . number_format($amount, 2, '.', '') . " INR",
    font: $font
);

// Generate QR code with writer
$writer = new PngWriter();
$result = $writer->write($qrCode, $logo, $label);

// Output QR code as PNG
header('Content-Type: ' . $result->getMimeType());
echo $result->getString();

?>
