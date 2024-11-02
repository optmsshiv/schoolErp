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

// Check database connection
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

// Read and decode JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input: ' . json_last_error_msg()]);
    exit();
}

// Ensure 'data' key exists and is an array
if (!isset($data['tableData']) || !is_array($data['tableData'])) {
    echo json_encode(['success' => false, 'message' => 'No valid data provided']);
    exit();
}

// Prepare SQL statement for insertion
$stmt = $conn->prepare("
    INSERT INTO students
    (first_name, last_name, phone, email, dob, gender, class_name, category, religion, guardian, handicapped, father_name, mother_name, roll_no, sr_no, pen_no, aadhar_no, admission_no, admission_date, day_hosteler)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Statement preparation failed: ' . $conn->error]);
    exit();
}

// Process each row in tableData array
foreach ($data['tableData'] as $row) {
    // Ensure each row has exactly 20 values
    if (count($row) !== 20) {
        echo json_encode(['success' => false, 'message' => 'Invalid row data format']);
        exit();
    }

    // Bind and execute the prepared statement
    $stmt->bind_param("ssssssssssssssssssss", ...$row);
    if (!$stmt->execute()) {
        echo json_encode(['success' => false, 'message' => 'Insert failed: ' . $stmt->error]);
        exit();
    }
}

// Clean up
$stmt->close();
$conn->close();

// Return success message
echo json_encode(['success' => true, 'message' => 'Data uploaded successfully!']);
?>
