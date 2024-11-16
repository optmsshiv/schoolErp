<?php
// Include the database connection file
include '../db_connection.php';

header('Content-Type: application/json');

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Check if class_name is set and not empty
    if (isset($_POST['class_name']) && !empty($_POST['class_name'])) {
        $className = trim($_POST['class_name']); // Sanitize input

        try {
            // First, check if the class exists
            $checkSql = "SELECT class_id FROM Classes WHERE class_name = :class_name";
            $checkStmt = $pdo->prepare($checkSql);
            $checkStmt->bindParam(':class_name', $className, PDO::PARAM_STR);
            $checkStmt->execute();

            // If the class doesn't exist, return an error message
            if ($checkStmt->rowCount() === 0) {
                echo json_encode(['status' => 'error', 'message' => 'Class not found or already deleted']);
                exit;
            }

            // Proceed with deleting the class
            $deleteSql = "DELETE FROM Classes WHERE class_name = :class_name";
            $deleteStmt = $pdo->prepare($deleteSql);
            $deleteStmt->bindParam(':class_name', $className, PDO::PARAM_STR);
            $deleteStmt->execute();

            // Return success response
            echo json_encode(['status' => 'success', 'message' => 'Class deleted successfully']);
        } catch (PDOException $e) {
            // Catch any PDO exceptions (e.g., database connection issues)
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        }
    } else {
        // If class_name is not provided, return an error
        echo json_encode(['status' => 'error', 'message' => 'Class name is required']);
    }
} else {
    // If the request method is not POST, return an error
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>
