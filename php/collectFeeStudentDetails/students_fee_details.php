<?php
// Database connection
// Include the database connection file
include '../db_connection.php';

header('Content-Type: application/json');

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Query to fetch student data
$sql = "SELECT
            CONCAT(first_name, ' ', last_name) AS full_name,
            class_name,
            phone,
            date_of_birth,
            gender,
            father_name,
            mother_name,
            roll_no,
            day_hosteler,
            admission_no
        FROM students";
$result = $conn->query($sql);

$data = [];
if ($result->num_rows > 0) {
    // Fetch all rows as an associative array
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

// Return data as JSON
header('Content-Type: application/json');
echo json_encode($data);

$conn->close();
?>
