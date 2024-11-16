<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

// Database connection
include '../php/db_connection.php'; // Ensure the correct path to your connection file

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $className = trim($_POST['className'] ?? '');

    if (empty($className)) {
        echo json_encode(['status' => 'error', 'message' => 'Class name is required']);
        exit;
    }

    try {
        $stmt = $conn->prepare("INSERT INTO Classes (class_name) VALUES (?)");
        $stmt->bind_param("s", $className);

        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Class added successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to add class']);
        }
        $stmt->close();
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>
