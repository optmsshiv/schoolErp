<?php
require $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';

if (!class_exists('Endroid\QrCode\Builder\Builder')) {
    die("Error: Endroid QR Code Builder class not found. Check composer installation.");
}

echo "QR Code Builder is available!";
?>
