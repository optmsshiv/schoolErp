<?php
header('Content-Type: application/json');

// Database connection parameters
$servername = "localhost:3306";
$username = "edrppymy_admin";
$password = "13579@demo";
$dbname = "edrppymy_rrgis";

// Connect to the database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]));
}

// Check if a file is uploaded
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
  echo json_encode(["success" => false, "message" => "File upload error."]);
  exit;
}

// Validate file type (only CSV allowed)
$fileType = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
if (strtolower($fileType) !== 'csv') {
  echo json_encode(["success" => false, "message" => "Invalid file type. Only CSV files are allowed."]);
  exit;
}

// Open the CSV file
$file = fopen($_FILES['file']['tmp_name'], 'r');
if ($file === false) {
  echo json_encode(["success" => false, "message" => "Failed to open the CSV file."]);
  exit;
}

// Skip the header row
fgetcsv($file);

// Prepare SQL statement
$stmt = $conn->prepare("INSERT INTO students (first_name, last_name, phone, email, date_of_birth, gender, class_name, category, religion, guardian, handicapped, father_name, mother_name, roll_no, sr_no, pen_no, aadhar_no, admission_no, admission_date, day_hosteler) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

if (!$stmt) {
  echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
  exit;
}

// Bind parameters to the SQL statement
$stmt->bind_param("ssssssssssssssssssss", $first_name, $last_name, $phone, $email, $date_of_birth, $gender, $class_name, $category, $religion, $guardian, $handicapped, $father_name, $mother_name, $roll_no, $sr_no, $pen_no, $aadhar_no, $admission_no, $admission_date, $day_hosteler);

// Read each row of the CSV file
while (($row = fgetcsv($file, 1000, ",")) !== false) {
  // Assign CSV columns to variables
  list($s_no, $first_name, $last_name, $phone, $email, $date_of_birth, $gender, $class_name, $category, $religion, $guardian, $handicapped, $father_name, $mother_name, $roll_no, $sr_no, $pen_no, $aadhar_no, $admission_no, $admission_date, $day_hosteler) = $row;

  // Execute the prepared statement
  if (!$stmt->execute()) {
      echo json_encode(["success" => false, "message" => "Error inserting row: " . $stmt->error]);
      exit;
  }
}

// Close resources
fclose($file);
$stmt->close();
$conn->close();

// Return success response
echo json_encode(["success" => true, "message" => "Data uploaded successfully!"]);
exit;
?>
