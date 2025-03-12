<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require '/vendor/autoload.php';  // Check this path!

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;

try {
    // Get the amount from the query parameter
    $amount = isset($_GET['amount']) ? floatval($_GET['amount']) : 0;

    // Define UPI ID (fetch from database if dynamic per school)
    $upi_id = "optmsshiv@axisbank";  // Replace with your actual UPI ID

    if ($amount <= 0) {
        throw new Exception("Invalid amount: $amount");
    }

    // Generate the UPI payment URI
    $upi_uri = "upi://pay?pa=$upi_id&pn=School%20Fees&mc=0000&tid=123456&tr=ABC123&tn=Fee%20Payment&am=$amount&cu=INR";

    // Debugging
    error_log("Generating QR for UPI URI: $upi_uri");

    // Create QR code
    $qrCode = QrCode::create($upi_uri)
        ->setSize(300)
        ->setMargin(10)
        ->setWriter(new PngWriter());

    // Output the QR code as a PNG image
    header('Content-Type: image/png');
    echo $qrCode->getString();

} catch (Exception $e) {
    // Log and display error
    error_log("QR Code Generation Error: " . $e->getMessage());
    http_response_code(500);
    echo "Error: " . $e->getMessage();
}

?>
