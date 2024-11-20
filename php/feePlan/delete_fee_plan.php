<?php
// Include the database connection file
include '../db_connection.php';

header('Content-Type: application/json');

// Ensure the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if class_name is provided
    $className = isset($_POST['class_name']) ? trim($_POST['class_name']) : null;

    if (!$className) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Class name is required.'
        ]);
        exit;
    }

    try {
        // Check if the class exists in the FeePlans table
        $checkSql = "SELECT COUNT(*) FROM FeePlans WHERE class_name = :class_name";
        $checkStmt = $pdo->prepare($checkSql);
        $checkStmt->bindParam(':class_name', $className, PDO::PARAM_STR);
        $checkStmt->execute();

        $classExists = $checkStmt->fetchColumn();

        if (!$classExists) {
            // If no class found, return an error message
            echo json_encode([
                'status' => 'error',
                'message' => 'Class not found or already deleted.'
            ]);
            exit;
        }

        // Proceed with the deletion
        $deleteSql = "DELETE FROM FeePlans WHERE class_name = :class_name";
        $deleteStmt = $pdo->prepare($deleteSql);
        $deleteStmt->bindParam(':class_name', $className, PDO::PARAM_STR);

        if ($deleteStmt->execute()) {
            // If deletion was successful
            echo json_encode([
                'status' => 'success',
                'message' => 'Class deleted successfully.'
            ]);
        } else {
            // Handle unexpected failure during deletion
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to delete the class. Please try again later.'
            ]);
        }
    } catch (PDOException $e) {
        // Handle database errors
        echo json_encode([
            'status' => 'error',
            'message' => 'Database error: ' . $e->getMessage()
        ]);
    }
} else {
    // Handle invalid request method
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid request method. POST required.'
    ]);
}
?>
