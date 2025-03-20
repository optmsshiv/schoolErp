<?php

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require __DIR__ . '/../../vendor/autoload.php';

use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\Label\Label;
use Endroid\QrCode\Writer\PngWriter;

// Get amount from URL
$amount = isset($_GET['amount']) ? floatval($_GET['amount']) : 0;
$upi_id = "yourupi@upi";

if ($amount <= 0) {
    die("Invalid amount specified.");
}

// UPI QR Code data
$upi_uri = "upi://pay?pa=" . urlencode($upi_id) . "&pn=" . urlencode("School Fees") . "&am=" . urlencode(number_format($amount, 2, '.', '')) . "&cu=INR";

// Label (Optional)
$label = Label::create("Scan to Pay ₹" . number_format($amount, 2))->setFontSize(14);

// Generate QR Code
$result = Builder::create()
    ->writer(new PngWriter())
    ->data($upi_uri)
    ->encoding(new Encoding('UTF-8'))
    ->errorCorrectionLevel(ErrorCorrectionLevel::High)
    ->size(300)
    ->margin(10)
    ->label($label)
    ->build();

// Output QR code as PNG
header('Content-Type: ' . $result->getMimeType());
echo $result->getString();

?>
