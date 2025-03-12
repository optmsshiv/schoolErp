<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require '/home1/edrppymy/public_html/erp/vendor/autoload.php';

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\Label\Label;
use Endroid\QrCode\Color\Color;

// Get the amount from the query parameter
$amount = isset($_GET['amount']) ? floatval($_GET['amount']) : 0;

// Define UPI ID (fetch from database if dynamic per school)
$upi_id = "optmsshiv@axisbank";  // Replace with your actual UPI ID

if ($amount <= 0) {
    die("Error: Invalid amount");
}

// Generate the UPI payment URI
$upi_uri = "upi://pay?pa=$upi_id&pn=School%20Fees&mc=0000&tid=123456&tr=ABC123&tn=Fee%20Payment&am=$amount&cu=INR";

// Generate the QR code
$qrCode = QrCode::create($upi_uri)
    ->setEncoding(new Encoding('UTF-8'))
    ->setErrorCorrectionLevel(ErrorCorrectionLevel::High)
    ->setSize(300)
    ->setMargin(10)
    ->setForegroundColor(new Color(0, 0, 0)) // Black QR Code
    ->setBackgroundColor(new Color(255, 255, 255)); // White Background

$writer = new PngWriter();
$result = $writer->write($qrCode);

header('Content-Type: image/png');
echo $result->getString();
