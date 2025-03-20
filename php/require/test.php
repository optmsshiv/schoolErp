<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require '/home1/edrppymy/public_html/erp/vendor/autoload.php';
  // Adjust based on your project structure


  use Endroid\QrCode\QrCode;
  use Endroid\QrCode\Encoding\Encoding;
  use Endroid\QrCode\ErrorCorrectionLevel;
  use Endroid\QrCode\Writer\PngWriter;

  // Instantiate QrCode object correctly
  $qrCode = new QrCode('Hello from Live Server!');
  $qrCode->setEncoding(new Encoding('UTF-8'))
         ->setErrorCorrectionLevel(ErrorCorrectionLevel::High)
         ->setSize(300)
         ->setMargin(10);

  $writer = new PngWriter();
  $result = $writer->write($qrCode);

  // Output the QR code as PNG
  header('Content-Type: ' . $result->getMimeType());
  echo $result->getString();
  ?>
