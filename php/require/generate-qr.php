<?php
require $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';

use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Static test QR code content
$upi_uri = "upi://pay?pa=yourupi@upi&pn=TestPayment&am=10&cu=INR";

// Generate QR Code
$result = Builder::create()
    ->writer(new PngWriter())
    ->data($upi_uri)
    ->encoding(new Encoding('UTF-8'))
    ->errorCorrectionLevel(ErrorCorrectionLevel::High)
    ->size(300)
    ->margin(10)
    ->build();

// Debugging: Check if QR code was generated
if (!$result) {
    die("Error: QR Code generation failed.");
}

// Output QR Code image
header('Content-Type: image/png');
echo $result->getString();
?>
