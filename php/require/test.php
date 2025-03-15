<?php

// Set content type
header('Content-Type: image/png');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

error_reporting(0);
ini_set('display_errors', 0);

require $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;

// Get the amount from query parameters
$amount = isset($_GET['amount']) ? floatval($_GET['amount']) : 0;
$upi_id = "yourupi@upi";

if ($amount <= 0) {
    http_response_code(400);
    exit;
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
$result = $writer->write($qrCode);

// Output QR Code
echo $result->getString();
exit;

?>
