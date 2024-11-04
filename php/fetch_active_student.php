<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database configuration
$servername = "localhost";
$username = "edrppymy_admin";
$password = "13579@demo";
$dbname = "edrppymy_rrgis";
$port = 3306;

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

// Query to fetch student data including user_id
$sql = "SELECT id, first_name, last_name, father_name, class_name, roll_no, phone, user_id FROM students";
$result = $conn->query($sql);

if (!$result) {
    die(json_encode(['error' => 'Error with query: ' . $conn->error]));
}

$students = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Add each row to the array as-is, including the existing user_id
        $students[] = $row;
    }
}

// Set the content type to application/json
header('Content-Type: application/json');

// Return the JSON response with the fetched data
echo json_encode($students);

// Close connection
$conn->close();
?>
