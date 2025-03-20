<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require '/home1/edrppymy/public_html/erp/vendor/autoload.php';
  // Adjust based on your project structure


use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;

$qrCode = new QrCode('Hello from Live Server!');
$qrCode->setSize(300);
$qrCode->setMargin(10);

$writer = new PngWriter();
$result = $writer->write($qrCode);

// Output as PNG
header('Content-Type: '.$result->getMimeType());
echo $result->getString();
?>
