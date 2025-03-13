<?php
require $_SERVER['DOCUMENT_ROOT'] . 'vendor/autoload.php';

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check if Endroid\QrCode\QrCode class exists
if (class_exists('Endroid\QrCode\QrCode')) {
    echo "Endroid QR Code library is properly loaded.";
} else {
    echo "Endroid QR Code library is NOT loaded!";
}
?>
