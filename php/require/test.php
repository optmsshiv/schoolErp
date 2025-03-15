<?php
$amount = 100;
$upi_id = "yourupi@upi";

$upi_uri = urlencode("upi://pay?pa=$upi_id&pn=School%20Fees&am=$amount&cu=INR");
$qr_url = "https://quickchart.io/qr?text=$upi_uri&size=300";

echo "<img src='$qr_url' alt='UPI QR Code' />";
?>
