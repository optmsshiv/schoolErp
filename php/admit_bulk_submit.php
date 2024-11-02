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
if ($mysqli->connect_error) {
  die("Connection failed: " . $mysqli->connect_error);
}

// Prepare the SQL statement
$stmt = $mysqli->prepare("INSERT INTO students (serial_number, first_name, last_name, phone, email, date_of_birth, gender, class_name, category, religion, guardian, handicapped, father_name, mother_name, roll_no, sr_no, pen_no, aadhar_no, admission_no, admission_date, day_hosteler) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

// Sample data for testing
$sampleStudents = [
  [
      'serial_number' => 1,
      'first_name' => 'John',
      'last_name' => 'Doe',
      'phone' => '1234567890',
      'email' => 'john.doe@example.com',
      'date_of_birth' => '2000-01-01',
      'gender' => 'Male',
      'class_name' => '10th Grade',
      'category' => 'General',
      'religion' => 'Christianity',
      'guardian' => 'Jane Doe',
      'handicapped' => 0,
      'father_name' => 'Mike Doe',
      'mother_name' => 'Anna Doe',
      'roll_no' => '001',
      'sr_no' => 'SR001',
      'pen_no' => 'PEN001',
      'aadhar_no' => '123456789012',
      'admission_no' => 'ADM001',
      'admission_date' => '2023-09-01',
      'day_hosteler' => 'Day'
  ],
  // You can add more sample data as needed
];

// Loop through sample data and insert
foreach ($sampleStudents as $student) {
  $stmt->bind_param("issssssssssssssssssss",
      $student['serial_number'],
      $student['first_name'],
      $student['last_name'],
      $student['phone'],
      $student['email'],
      $student['date_of_birth'],
      $student['gender'],
      $student['class_name'],
      $student['category'],
      $student['religion'],
      $student['guardian'],
      $student['handicapped'],
      $student['father_name'],
      $student['mother_name'],
      $student['roll_no'],
      $student['sr_no'],
      $student['pen_no'],
      $student['aadhar_no'],
      $student['admission_no'],
      $student['admission_date'],
      $student['day_hosteler']
  );

  // Execute the statement
  if (!$stmt->execute()) {
      echo "Error: " . $stmt->error . "<br/>";
  } else {
      echo "Inserted: " . $student['first_name'] . " " . $student['last_name'] . "<br/>";
  }
}

// Close the statement and connection
$stmt->close();
$mysqli->close();
?>
