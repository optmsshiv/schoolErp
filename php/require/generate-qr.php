<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// Ensure Composer dependencies are loaded
require __DIR__ . '/../../vendor/autoload.php';

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\Label\Label;
use Endroid\QrCode\Logo\Logo;
use Endroid\QrCode\ErrorCorrectionLevel;

// Get the amount from query parameters
$amount = isset($_GET['amount']) ? floatval($_GET['amount']) : 0;
$upi_id = "yourupi@upi"; // Replace with your actual UPI ID

if ($amount <= 0) {
    die("Invalid amount specified.");
}

// Generate UPI QR Code data
$upi_uri = "upi://pay?pa=" . urlencode($upi_id) . "&pn=" . urlencode("School Fees") . "&am=" . urlencode(number_format($amount, 2, '.', '')) . "&cu=INR";

// Create QR Code
$qrCode = new QrCode(
    $upi_uri,
    new Encoding('UTF-8'),
    ErrorCorrectionLevel::High
);

$writer = new PngWriter();

// Optional: Add Logo (Ensure the file path is correct)
$logoPath = $_SERVER['DOCUMENT_ROOT'] . '/assets/img/avatars/default-avatar.png';
$logo = null;

if (file_exists($logoPath)) {
    $logo = Logo::create($logoPath)->setResizeToWidth(50);
}

// Optional: Add a Label Below the QR Code
$label = Label::create("Scan to Pay ₹" . number_format($amount, 2))->setFontSize(14);

// Generate the final QR Code image
$result = $writer->write($qrCode, $logo, $label);

// Output the QR code as a PNG image
header('Content-Type: ' . $result->getMimeType());
echo $result->getString();

?>
