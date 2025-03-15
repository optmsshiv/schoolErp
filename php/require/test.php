<?php

// Set content type to PNG
header('Content-Type: image/png');

// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

require $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\Label\Label;
use Endroid\QrCode\Logo\Logo;
use Endroid\QrCode\ErrorCorrectionLevel;

// Get the amount from query parameters
$amount = isset($_GET['amount']) ? floatval($_GET['amount']) : 0;
$upi_id = "yourupi@upi";

// Validate amount
if ($amount <= 0) {
    http_response_code(400); // Bad Request
    exit; // Stop execution to prevent extra output
}

// Generate UPI QR Code data
$upi_uri = "upi://pay?pa=" . urlencode($upi_id) . "&pn=" . urlencode("School Fees") . "&am=" . urlencode($amount) . "&cu=INR";

// Create QR Code
$qrCode = QrCode::create($upi_uri)
    ->setEncoding(new Encoding('UTF-8'))
    ->setErrorCorrectionLevel(ErrorCorrectionLevel::HIGH())
    ->setSize(300)
    ->setMargin(10);

$writer = new PngWriter();

// Optional: Add Logo (Ensure file exists)
$logoPath = $_SERVER['DOCUMENT_ROOT'] . '/path/to/school_logo.png';
$logo = (file_exists($logoPath)) ? Logo::create($logoPath)->setResizeToWidth(50) : null;

// Optional: Add Label Below the QR Code
$label = Label::create("Scan to Pay ₹" . number_format($amount, 2))->setFontSize(14);

// Generate the QR Code
$result = $writer->write($qrCode, $logo, $label);

// Output the image
echo $result->getString();

?>
