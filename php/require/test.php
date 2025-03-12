<?php
require $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';

use Endroid\QrCode\Builder\Builder;

if (class_exists('Endroid\QrCode\Builder\Builder')) {
    echo "Builder class exists!";
} else {
    echo "Builder class NOT found!";
}
