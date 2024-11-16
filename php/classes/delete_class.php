<?php
// delete_class.php

// Include database connection
include_once('../config/database.php');

// Get the class name from the POST data
$className = isset($_POST['class_name']) ? $_POST['class_name'] : '';

// Check if class name is provided
if (empty($className)) {
    echo json_encode(['status' => 'error', 'message' => 'Class name is required']);
    exit;
}

// Prepare the SQL query to delete the class
$query = "DELETE FROM classes WHERE class_name = ?";

// Prepare statement
$stmt = $conn->prepare($query);

// Bind the class name to the prepared statement
$stmt->bind_param('s', $className);

// Execute the query
if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Class deleted successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to delete class']);
}

// Close statement
$stmt->close();

// Close database connection
$conn->close();
?>
