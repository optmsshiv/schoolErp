<?php
// Include the database connection file
include '../db_connection.php';

header('Content-Type: application/json');

try {
    // Check if class_name is provided in the request
    if (isset($_POST['class_name']) && !empty($_POST['class_name'])) {
        $className = trim($_POST['class_name']);

        // Prepare the SQL statement to delete the class by class_name
        $sql = "DELETE FROM Classes WHERE class_name = :class_name";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':class_name', $className, PDO::PARAM_STR);

        // Execute the statement
        $stmt->execute();

        // Check if a row was deleted
        if ($stmt->rowCount() > 0) {
            // Class deleted successfully
            echo json_encode(['status' => 'success', 'message' => 'Class deleted successfully']);
        } else {
            // No matching class found to delete
            echo json_encode(['status' => 'error', 'message' => 'Class not found or already deleted']);
        }
    } else {
        // Class name not provided in the request
        echo json_encode(['status' => 'error', 'message' => 'Class name is required']);
    }
} catch (PDOException $e) {
    // Log the error (instead of displaying it) for security reasons
    error_log('Database error: ' . $e->getMessage());

    // Return error response
    echo json_encode(['status' => 'error', 'message' => 'Database error. Please try again later.']);
}
?>
