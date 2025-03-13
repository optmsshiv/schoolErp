<?php
require $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';

if (class_exists('Endroid\QrCode\QrCode')) {
    echo "Endroid QR Code library is loaded!";
} else {
    echo "Error: Endroid QR Code library is NOT loaded!";
}
?>
