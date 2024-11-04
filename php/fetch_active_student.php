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
    die("Connection failed: " . $conn->connect_error);
}

// Query to fetch student data
$sql = "SELECT first_name, father_name, class_name, roll_no, phone FROM students";
$result = $conn->query($sql);

$data = array();

if ($result && $result->num_rows > 0) {
    // Output data of each row
    while ($row = $result->fetch_assoc()) {
        $data[] = $row; // Add each row to the data array
    }
}

// Return the data as JSON
header('Content-Type: application/json');
echo json_encode($data);

// Close connection
$conn->close();
?>
