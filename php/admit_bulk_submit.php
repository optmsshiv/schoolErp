<?php
header('Content-Type: application/json');

// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Database connection parameters
$servername = "localhost:3306";
$username = "edrppymy_admin";
$password = "13579@demo";
$dbname = "edrppymy_rrgis";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check database connection
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

// Read JSON input
$data = json_decode(file_get_contents('php://input'), true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input: ' . json_last_error_msg()]);
    exit();
}

if (isset($data['data']) && is_array($data['data'])) {
    // Prepare SQL statement
    $stmt = $conn->prepare("INSERT INTO students (first_name, last_name, phone, email, dob, gender, class_name, category, religion, guardian, handicapped, father_name, mother_name, roll_no, sr_no, pen_no, aadhar_no, admission_no, admission_date, day_hosteler) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Statement preparation failed: ' . $conn->error]);
        exit();
    }

    foreach ($data['data'] as $row) {
        // Validate that each row has the required 20 fields
        if (count($row) !== 20) {
            echo json_encode(['success' => false, 'message' => 'Invalid row data format']);
            exit();
        }

        $stmt->bind_param("ssssssssssssssssssss", ...$row);
        if (!$stmt->execute()) {
            echo json_encode(['success' => false, 'message' => 'Insert failed: ' . $stmt->error]);
            exit();
        }
    }

    $stmt->close();
    echo json_encode(['success' => true, 'message' => 'Data uploaded successfully!']);
} else {
    echo json_encode(['success' => false, 'message' => 'No valid data provided']);
}

$conn->close();
?>
