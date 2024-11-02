<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection parameters
$servername = "localhost";
$port = 3306;
$username = "edrppymy_admin";
$password = "13579@demo";
$dbname = "edrppymy_rrgis";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

// Get the raw POST data
$data = json_decode(file_get_contents("php://input"), true);
// Check connection
if ($conn->connect_error) {
  die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

// Get the raw POST data
$data = json_decode(file_get_contents("php://input"), true);

// Print the data for debugging
var_dump($data);

// Initialize an array to hold any failed insertions
$failed_inserts = [];

// Prepare the SQL statement
$stmt = $conn->prepare("INSERT INTO students (serial_number, first_name, last_name, phone, email, date_of_birth, gender, class_name, category, religion, guardian, handicapped, father_name, mother_name, roll_no, sr_no, pen_no, aadhar_no, admission_no, admission_date, day_hosteler) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

if (!$stmt) {
  die(json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]));
}

// Bind parameters
$stmt->bind_param("issssssssssssssssssss", $serial_number, $first_name, $last_name, $phone, $email, $date_of_birth, $gender, $class_name, $category, $religion, $guardian, $handicapped, $father_name, $mother_name, $roll_no, $sr_no, $pen_no, $aadhar_no, $admission_no, $admission_date, $day_hosteler);

// Loop through the incoming data
foreach ($data as $row) {
  // Ensure all values exist to avoid undefined index errors
  $serial_number = $row['serial_number'] ?? null;
  $first_name = $row['first_name'] ?? null;
  $last_name = $row['last_name'] ?? null;
  $phone = $row['phone'] ?? null;
  $email = $row['email'] ?? null;
  $date_of_birth = $row['date_of_birth'] ?? null;
  $gender = $row['gender'] ?? null;
  $class_name = $row['class_name'] ?? null;
  $category = $row['category'] ?? null;
  $religion = $row['religion'] ?? null;
  $guardian = $row['guardian'] ?? null;
  $handicapped = $row['handicapped'] ?? null;
  $father_name = $row['father_name'] ?? null;
  $mother_name = $row['mother_name'] ?? null;
  $roll_no = $row['roll_no'] ?? null;
  $sr_no = $row['sr_no'] ?? null;
  $pen_no = $row['pen_no'] ?? null;
  $aadhar_no = $row['aadhar_no'] ?? null;
  $admission_no = $row['admission_no'] ?? null;
  $admission_date = $row['admission_date'] ?? null;
  $day_hosteler = $row['day_hosteler'] ?? null;

  // Execute the statement
  if (!$stmt->execute()) {
      $failed_inserts[] = $row; // Keep track of failed inserts
  }
}

// Close the prepared statement and connection
$stmt->close();
$conn->close();

// Respond with success or failure
if (empty($failed_inserts)) {
  echo json_encode(['success' => true]);
} else {
  echo json_encode(['success' => false, 'message' => 'Some rows failed to insert.', 'failed_rows' => $failed_inserts]);
}
?>
