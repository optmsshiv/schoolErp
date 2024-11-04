<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database configuration
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

// Query to fetch student data
$sql = "SELECT first_name, father_name, class_name, roll_no, phone FROM students"; // Removed user_id from query
$result = $conn->query($sql);

if (!$result) {
    die(json_encode(['error' => 'Error with query: ' . $conn->error]));
}

$students = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Generate a unique user ID (this is just an example, adjust logic as needed)
        $user_id = uniqid('user_', true); // Generates a unique user ID
        $row['user_id'] = $user_id; // Add the generated user ID to the row
        $students[] = $row; // Add each row to the array
    }
}

// Set the content type to application/json
header('Content-Type: application/json');

// Return the JSON response
echo json_encode($students);

// Close connection
$conn->close();
?>
