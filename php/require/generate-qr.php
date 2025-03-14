<?php
require $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';

use BaconQrCode\Renderer\Image\Png;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;

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

// Create QR Code
$renderer = new Png(new RendererStyle(300)); // 300x300 size
$writer = new Writer($renderer);
$qrCode = $writer->writeString($upi_uri);

// Set headers and output image
header('Content-Type: image/png');
echo $qrCode;
?>
