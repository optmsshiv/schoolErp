<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Database connection parameters
$servername = "localhost:3306";
$username = "edrppymy_admin";
$password = "13579@demo";
$dbname = "edrppymy_rrgis";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit();
}

// Decode JSON data from the request
$data = json_decode(file_get_contents('php://input'), true);
$response = ["success" => true, "message" => "Data inserted successfully."];

foreach ($data as $row) {
    // Prepare the SQL statement
    $stmt = $conn->prepare("INSERT INTO students (
        serial_number, first_name, last_name, phone, email,
        date_of_birth, gender, class_name, category, religion,
        guardian, handicapped, father_name, mother_name,
        roll_no, sr_no, pen_no, aadhar_no, admission_no,
        admission_date, day_hosteler
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    // Check if prepare failed
    if ($stmt === false) {
        echo json_encode(["error" => "Prepare failed: " . $conn->error]);
        exit();
    }

    // Ensure there are exactly 21 parameters (matching the SQL statement)
    $stmt->bind_param("isssssssssssssssssssss",
        $row['serial_number'],  // Assuming this is an integer
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

    // Execute the statement and check for errors
    if (!$stmt->execute()) {
        $response["success"] = false;
        $response["message"] = "Error inserting data for serial_number: " . $row['serial_number'];
        $response["error"] = $stmt->error;
        break;
    }
}

$stmt->close();
$conn->close();

// Output JSON response
header('Content-Type: application/json');
echo json_encode($response);
?>
