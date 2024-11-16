<?php
// Include the database connection file
include '../db_connection.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if class_name is set and not empty
    if (isset($_POST['class_name']) && !empty($_POST['class_name'])) {
        $className = trim($_POST['class_name']);

        try {
            // First, check if the class exists
            $checkSql = "SELECT class_name FROM Classes WHERE class_name = :class_name";
            $checkStmt = $pdo->prepare($checkSql);
            $checkStmt->bindParam(':class_name', $className, PDO::PARAM_STR);
            $checkStmt->execute();

            // If the class doesn't exist, return an error message
            if ($checkStmt->rowCount() === 0) {
                echo json_encode(['status' => 'error', 'message' => 'Class not found or already deleted']);
                exit;
            }

            // Proceed with deleting the class
            $sql = "DELETE FROM Classes WHERE class_name = :class_name";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':class_name', $className, PDO::PARAM_STR);
            $stmt->execute();

            // Return success response
            echo json_encode(['status' => 'success', 'message' => 'Class deleted successfully']);
        } catch (PDOException $e) {
            // Handle any database errors
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        }
    } else {
        // Class name not provided
        echo json_encode(['status' => 'error', 'message' => 'Class name is required']);
    }
} else {
    // Invalid request method
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>
