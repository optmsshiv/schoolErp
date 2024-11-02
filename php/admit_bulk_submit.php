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

try {
  // Create a new PDO instance
  $pdo = new PDO("mysql:servername=$servername;dbname=$dbname;charset=utf8", $username, $password);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  // Get the JSON data from the POST request
  $data = json_decode($_POST['tableData'], true);

  // Prepare an SQL statement for inserting data
  $stmt = $pdo->prepare("
      INSERT INTO students (serial_number, first_name, last_name, phone, email, date_of_birth, gender, class_name, category, religion, guardian, handicapped, father_name, mother_name, roll_no, sr_no, pen_no, aadhar_no, admission_no, admission_date, day_hosteler)
      VALUES (:serial_number, :first_name, :last_name, :phone, :email, :date_of_birth, :gender, :class_name, :category, :religion, :guardian, :handicapped, :father_name, :mother_name, :roll_no, :sr_no, :pen_no, :aadhar_no, :admission_no, :admission_date, :day_hosteler)
  ");

  // Loop through each row of data
  foreach ($data as $row) {
      // Bind parameters to the SQL statement
      $stmt->bindParam(':serial_number', $row['serial_number']);
      $stmt->bindParam(':first_name', $row['first_name']);
      $stmt->bindParam(':last_name', $row['last_name']);
      $stmt->bindParam(':phone', $row['phone']);
      $stmt->bindParam(':email', $row['email']);
      $stmt->bindParam(':date_of_birth', $row['date_of_birth']);
      $stmt->bindParam(':gender', $row['gender']);
      $stmt->bindParam(':class_name', $row['class_name']);
      $stmt->bindParam(':category', $row['category']);
      $stmt->bindParam(':religion', $row['religion']);
      $stmt->bindParam(':guardian', $row['guardian']);
      $stmt->bindParam(':handicapped', $row['handicapped']);
      $stmt->bindParam(':father_name', $row['father_name']);
      $stmt->bindParam(':mother_name', $row['mother_name']);
      $stmt->bindParam(':roll_no', $row['roll_no']);
      $stmt->bindParam(':sr_no', $row['sr_no']);
      $stmt->bindParam(':pen_no', $row['pen_no']);
      $stmt->bindParam(':aadhar_no', $row['aadhar_no']);
      $stmt->bindParam(':admission_no', $row['admission_no']);
      $stmt->bindParam(':admission_date', $row['admission_date']);
      $stmt->bindParam(':day_hosteler', $row['day_hosteler']);

      // Execute the statement
      $stmt->execute();
  }

  // Return a success response
  echo json_encode(['success' => true, 'message' => 'Data submitted successfully!']);
} catch (PDOException $e) {
  // Handle any errors
  echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
