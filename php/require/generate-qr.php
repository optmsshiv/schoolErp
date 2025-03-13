<?php
require $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';

if (!class_exists('Endroid\QrCode\Builder\Builder')) {
    die('Builder class not found. Check your installation.');
}

use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Get the amount from the query parameter
$amount = isset($_GET['amount']) ? floatval($_GET['amount']) : 0;
$upi_id = "yourupi@upi";  // Replace with your actual UPI ID

if ($amount <= 0) {
    die("Invalid amount");
}

// Generate the UPI payment URI
$upi_uri = "upi://pay?pa=$upi_id&pn=School%20Fees&am=$amount&cu=INR";

// Use Builder for QR Code generation
$result = Builder::create()
    ->data($upi_uri)
    ->writer(new PngWriter())
    ->encoding(new Encoding('UTF-8'))
    ->errorCorrectionLevel(ErrorCorrectionLevel::High)
    ->size(300) // Set the size here
    ->margin(10) // Set the margin here
    ->build();

// Set headers and output image
header('Content-Type: image/png');
echo $result->getString();
?>
