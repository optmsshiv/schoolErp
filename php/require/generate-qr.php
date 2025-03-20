<?php

header('Content-Type: image/png');
error_reporting(E_ALL);
ini_set('display_errors', 1);

require __DIR__ . '/../../vendor/autoload.php';

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\Label\Label;
use Endroid\QrCode\Logo\Logo;
use Endroid\QrCode\ErrorCorrectionLevel;

// Get the amount from query parameters
$amount = isset($_GET['amount']) ? floatval($_GET['amount']) : 0;
$upi_id = "yourupi@upi";

if ($amount <= 0) {
    die("Invalid amount specified.");
}

// Generate UPI QR Code data
$upi_uri = "upi://pay?pa=" . urlencode($upi_id) . "&pn=" . urlencode("School Fees") . "&am=" . urlencode($amount) . "&cu=INR";

// Create QR Code (Updated Syntax)
$qrCode = new QrCode(
    $upi_uri,
    new Encoding('UTF-8'),
    ErrorCorrectionLevel::High
);

$writer = new PngWriter();

// Optional: Add Logo (Ensure the file path is correct)
$logoPath = $_SERVER['DOCUMENT_ROOT'] . '/path/to/school_logo.png';
$logo = file_exists($logoPath) ? Logo::create($logoPath)->setResizeToWidth(50) : null;

// Optional: Add a Label Below the QR Code
$label = Label::create("Scan to Pay ₹" . number_format($amount, 2))->setFontSize(14);

// Generate the final QR Code image
$result = $writer->write($qrCode, $logo, $label);

// Output the QR code as a PNG image
header('Content-Type: ' . $result->getMimeType());
echo $result->getString();
?>
