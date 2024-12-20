<?php
// Database connection
include '../db_connection.php';

header('Content-Type: application/json');

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Query to fetch student data along with hostel fee
$sql = "SELECT
            CONCAT(students.first_name, ' ', students.last_name) AS full_name,
            students.class_name,
            students.phone,
            students.date_of_birth,
            students.gender,
            students.father_name,
            students.mother_name,
            students.roll_no,
            students.day_hosteler,
            students.admission_no,
            students.hostel_id,
            hostels.hostel_name,
            hostels.hostel_fee,
            students.transport_id
        FROM students
        LEFT JOIN hostels ON students.hostel_id = hostels.hostel_id"; // Join with hostels table

$result = $conn->query($sql);

$data = [];
if ($result->num_rows > 0) {
    // Fetch all rows as an associative array
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

// Return data as JSON
echo json_encode($data);

$conn->close();
?>
