<?php

require $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';

use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\Color\Color;
use Endroid\QrCode\Writer\PngWriter;

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
$result = Builder::create()
    ->writer(new PngWriter())
    ->data($upi_uri)
    ->encoding(new Encoding('UTF-8'))
    ->errorCorrectionLevel(ErrorCorrectionLevel::High)
    ->size(300)
    ->margin(10)
    ->foregroundColor(new Color(0, 0, 0))
    ->backgroundColor(new Color(255, 255, 255))
    ->build();

// Output the QR code
header('Content-Type: image/png');
echo $result->getString();
