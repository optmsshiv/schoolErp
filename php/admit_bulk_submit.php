<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

// Database connection parameters
$servername = "localhost:3306";
$username = "edrppymy_admin";
$password = "13579@demo";
$dbname = "edrppymy_rrgis";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

// Decode the JSON data
$data = json_decode(file_get_contents('php://input'), true);

// Check for JSON decoding errors
if (json_last_error() !== JSON_ERROR_NONE) {
    die(json_encode(['error' => 'JSON decoding error: ' . json_last_error_msg()]));
}

// Prepare the SQL statement
$stmt = $conn->prepare("INSERT INTO students (
    serial_number, first_name, last_name, phone, email,
    date_of_birth, gender, class_name, category, religion,
    guardian, handicapped, father_name, mother_name,
    roll_no, sr_no, pen_no, aadhar_no, admission_no,
    admission_date, day_hosteler) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

// Check if the statement was prepared successfully
if (!$stmt) {
    die(json_encode(['error' => 'Prepare failed: ' . $conn->error]));
}

// Bind parameters and execute for each row of data
foreach ($data as $row) {
    // Check if all required keys are set
    if (!isset($row['serial_number'], $row['first_name'], $row['last_name'], $row['phone'],
                $row['email'], $row['date_of_birth'], $row['gender'], $row['class_name'],
                $row['category'], $row['religion'], $row['guardian'], $row['handicapped'],
                $row['father_name'], $row['mother_name'], $row['roll_no'], $row['sr_no'],
                $row['pen_no'], $row['aadhar_no'], $row['admission_no'], $row['admission_date'],
                $row['day_hosteler'])) {
        die(json_encode(['error' => 'Missing required fields in data']));
    }

    $stmt->bind_param("isssssssssssssssssssss",
        $row['serial_number'],
        $row['first_name'],
        $row['last_name'],
        $row['phone'],
        $row['email'],
        $row['date_of_birth'],
        $row['gender'],
        $row['class_name'],
        $row['category'],
        $row['religion'],
        $row['guardian'],
        $row['handicapped'],
        $row['father_name'],
        $row['mother_name'],
        $row['roll_no'],
        $row['sr_no'],
        $row['pen_no'],
        $row['aadhar_no'],
        $row['admission_no'],
        $row['admission_date'],
        $row['day_hosteler']
    );

    if (!$stmt->execute()) {
        die(json_encode(['error' => 'Execute failed: ' . $stmt->error]));
    }
}

// Close the statement and connection
$stmt->close();
$conn->close();

// Send a success response
echo json_encode(['success' => true]);
?>
