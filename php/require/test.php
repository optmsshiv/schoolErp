<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require __DIR__ . '/vendor/autoload.php';  // Adjust based on your project structure


use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;

$qrCode = QrCode::create('Hello from Live Server!')
    ->setSize(300)
    ->setMargin(10);

$writer = new PngWriter();
$result = $writer->write($qrCode);

// Output as PNG
header('Content-Type: '.$result->getMimeType());
echo $result->getString();
?>
