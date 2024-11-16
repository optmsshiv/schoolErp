<?php
// Include the database connection file
include '../db_connection.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['class_name']) && !empty($_POST['class_name'])) {
        $className = trim($_POST['class_name']);

        try {
            // Check if the class exists
            $checkSql = "SELECT class_id FROM Classes WHERE class_name = :class_name";
            $checkStmt = $pdo->prepare($checkSql);
            $checkStmt->bindParam(':class_name', $className, PDO::PARAM_STR);
            $checkStmt->execute();

            if ($checkStmt->rowCount() === 0) {
                // If no class found, return error message
                echo json_encode(['status' => 'error', 'message' => 'Class not found or already deleted']);
                exit;
            }

            // Proceed with the deletion
            $deleteSql = "DELETE FROM Classes WHERE class_name = :class_name";
            $deleteStmt = $pdo->prepare($deleteSql);
            $deleteStmt->bindParam(':class_name', $className, PDO::PARAM_STR);
            $deleteStmt->execute();

            // If deletion was successful
            echo json_encode(['status' => 'success', 'message' => 'Class deleted successfully']);
        } catch (PDOException $e) {
            // Handle database errors
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Class name is required']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>
