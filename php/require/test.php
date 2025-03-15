<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: image/png');
$im = imagecreate(300, 300);
$bg = imagecolorallocate($im, 255, 255, 255);
$text_color = imagecolorallocate($im, 0, 0, 0);
imagestring($im, 5, 75, 130, 'Test Image', $text_color);
imagepng($im);
imagedestroy($im);
?>
