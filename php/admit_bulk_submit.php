<?php
header('Content-Type: application/json');

// Database connection parameters
$servername = "localhost:3306";
$username = "edrppymy_admin";
$password = "13579@demo";
$dbname = "edrppymy_rrgis";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents('php://input'), true);

foreach ($data as $row) {
  $stmt = $conn->prepare("INSERT INTO students (serial_number, first_name, last_name, phone, email, date_of_birth, gender, class_name, category, religion, guardian, handicapped, father_name, mother_name, roll_no, sr_no, pen_no, aadhar_no, admission_no, admission_date, day_hosteler) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

  $stmt->bind_param("isssssssssssssssssssss",
    $row['serial_number'], $row['first_name'], $row['last_name'], $row['phone'], $row['email'], $row['date_of_birth'], $row['gender'], $row['class_name'], $row['category'], $row['religion'], $row['guardian'], $row['handicapped'], $row['father_name'], $row['mother_name'], $row['roll_no'], $row['sr_no'], $row['pen_no'], $row['aadhar_no'], $row['admission_no'], $row['admission_date'], $row['day_hosteler']);
  $stmt->execute();
}

$stmt->close();
$conn->close();
?>
