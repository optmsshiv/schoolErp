<?php
header('Content-Type: application/json');

// Enable error reporting for debugging (disable in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Database connection parameters
$servername = "localhost:3306";
$username = "edrppymy_admin";
$password = "13579@demo";
$dbname = "edrppymy_rrgis";

// Connect to the database
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents('php://input'), true);

foreach ($data as $row) {
  $stmt = $conn->prepare("INSERT INTO students (SNo, firstName, lastName, phone, email, dob, gender, className, category, religion, guardian, handicapped, fatherName, motherName, rollNo, srNo, penNo, aadharNo, admissionNo, admissionDate, dayHosteler) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
  $stmt->bind_param("isssssssssssssssssssss",
    $row['SNo'], $row['firstName'], $row['lastName'], $row['phone'], $row['email'], $row['dob'], $row['gender'], $row['className'], $row['category'], $row['religion'], $row['guardian'], $row['handicapped'], $row['fatherName'], $row['motherName'], $row['rollNo'], $row['srNo'], $row['penNo'], $row['aadharNo'], $row['admissionNo'], $row['admissionDate'], $row['dayHosteler']);
  $stmt->execute();
}

$stmt->close();
$conn->close();
?>
