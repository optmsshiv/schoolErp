<?php
require __DIR__ . '/../../vendor/autoload.php'; // Adjust path if needed

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\Writer\PngWriter;

// Create a QR Code with proper syntax for v6
$qrCode = new QrCode(
    'Hello from Live Server!',
    new Encoding('UTF-8'),
    ErrorCorrectionLevel::High
);

$writer = new PngWriter();
$result = $writer->write($qrCode);

// Set the correct header for PNG output
header('Content-Type: ' . $result->getMimeType());
echo $result->getString();
?>

