<?php
require $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';

use Endroid\QrCode\Builder\Builder;

if (class_exists(Builder::class)) {
    echo "Builder class is available!";
} else {
    echo "Builder class is NOT available!";
}
?>
