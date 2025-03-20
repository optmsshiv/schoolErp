<?php
require '/vendor/autoload.php';

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;

$qrCode = QrCode::create('Hello, World!')
    ->setSize(300)
    ->setMargin(10);

$writer = new PngWriter();
$result = $writer->write($qrCode);

// Output as PNG
header('Content-Type: '.$result->getMimeType());
echo $result->getString();
?>
