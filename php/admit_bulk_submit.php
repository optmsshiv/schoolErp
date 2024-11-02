<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

// Database connection parameters
$servername = "localhost:3306";
$username = "edrppymy_admin";
$password = "13579@demo";
$dbname = "edrppymy_rrgis";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Decode the JSON data from the form
$tableData = json_decode($_POST['tableData'], true);

// Prepare an SQL statement
$stmt = $conn->prepare("INSERT INTO students (serial_number, first_name, last_name, phone, email, date_of_birth, gender, class_name, category, religion, guardian, handicapped, father_name, mother_name, roll_no, sr_no, pen_no, aadhar_no, admission_no, admission_date, day_hosteler) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

// Bind parameters
$stmt->bind_param("issssssssissssssssssss", $serial_number, $first_name, $last_name, $phone, $email, $date_of_birth, $gender, $class_name, $category, $religion, $guardian, $handicapped, $father_name, $mother_name, $roll_no, $sr_no, $pen_no, $aadhar_no, $admission_no, $admission_date, $day_hosteler);

// Loop through each row of data and execute the insert
foreach ($tableData as $data) {
    $serial_number = $data['serial_number'];
    $first_name = $data['first_name'];
    $last_name = $data['last_name'];
    $phone = $data['phone'];
    $email = $data['email'];
    $date_of_birth = $data['date_of_birth'];
    $gender = $data['gender'];
    $class_name = $data['class_name'];
    $category = $data['category'];
    $religion = $data['religion'];
    $guardian = $data['guardian'];
    $handicapped = $data['handicapped'] ? 1 : 0; // Convert to boolean
    $father_name = $data['father_name'];
    $mother_name = $data['mother_name'];
    $roll_no = $data['roll_no'];
    $sr_no = $data['sr_no'];
    $pen_no = $data['pen_no'];
    $aadhar_no = $data['aadhar_no'];
    $admission_no = $data['admission_no'];
    $admission_date = $data['admission_date'];
    $day_hosteler = $data['day_hosteler'];

    $stmt->execute(); // Execute the prepared statement
}

// Close connections
$stmt->close();
$conn->close();

echo "Data submitted successfully!";
?>
