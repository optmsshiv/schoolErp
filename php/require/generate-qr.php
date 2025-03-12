<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';

use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\Label\Label;
use Endroid\QrCode\Color\Color;
use Endroid\QrCode\Writer\PngWriter;

// Debug: Check if the library is loading
echo "QR Code library loaded successfully!<br>";

// Get the amount from the query parameter
$amount = isset($_GET['amount']) ? floatval($_GET['amount']) : 0;

if ($amount <= 0) {
    die("Error: Invalid amount");
}

// Define UPI ID
$upi_id = "optmsshiv@axisbank";  // Replace with your actual UPI ID

// Generate the UPI payment URI
$upi_uri = "upi://pay?pa=$upi_id&pn=School%20Fees&mc=0000&tid=123456&tr=ABC123&tn=Fee%20Payment&am=$amount&cu=INR";

// Generate QR Code using Builder (for v6.x)
$result = Builder::create()
    ->data($upi_uri)
    ->encoding(new Encoding('UTF-8'))
    ->errorCorrectionLevel(ErrorCorrectionLevel::High)
    ->size(300)
    ->margin(10)
    ->writer(new PngWriter())
    ->foregroundColor(new Color(0, 0, 0)) // Black QR Code
    ->backgroundColor(new Color(255, 255, 255)) // White Background
    ->build();

// Set the correct headers
header('Content-Type: image/png');
echo $result->getString();
exit;
