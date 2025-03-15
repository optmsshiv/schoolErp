<?php
require 'vendor/autoload.php';

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

// Create QR Code
$qrCode = QrCode::create($upi_uri)
    ->setEncoding(new Encoding('UTF-8'))
    ->setErrorCorrectionLevel(ErrorCorrectionLevel::High)
    ->setSize(300)
    ->setMargin(10)
    ->setWriter(new PngWriter());

// Optional: Add Logo (School Logo or UPI Logo)
$logo = Logo::create('school_logo.png')->setResizeToWidth(50);
$qrCode->setLogo($logo);

// Optional: Add a Label Below the QR Code
$label = Label::create("Scan to Pay ₹" . number_format($amount, 2))->setFontSize(14);
$qrCode->setLabel($label);

// Output as Image
header('Content-Type: image/png');
echo $qrCode->getString();
