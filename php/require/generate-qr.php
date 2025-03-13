<?php
require $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';

use Endroid\QrCode\QrCode;
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

// ✅ Correct approach for v6.0.5
$qrCode = new QrCode($upi_uri);
$qrCode->setEncoding(new Encoding('UTF-8'))
       ->setErrorCorrectionLevel(ErrorCorrectionLevel::High)
       ->setSize(300)
       ->setMargin(10);

// Generate PNG image
$writer = new PngWriter();
$result = $writer->write($qrCode);

// Set headers and output image
header('Content-Type: image/png');
echo $result->getString();
?>
