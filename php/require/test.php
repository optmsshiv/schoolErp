<?php
$amount = 100; // Example amount
$upi_id = "yourupi@upi";  // Replace with your actual UPI ID

$upi_uri = rawurlencode("upi://pay?pa=$upi_id&pn=School%20Fees&am=$amount&cu=INR");
$qr_url = "https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=$upi_uri&choe=UTF-8";

echo "<p>QR URL: <a href='$qr_url' target='_blank'>$qr_url</a></p>";
echo "<img src='$qr_url' alt='UPI QR Code' />";
?>
