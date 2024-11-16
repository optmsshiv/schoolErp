<?php
// Include the database connection file
include '../db_connection.php';

header('Content-Type: application/json');

// Ensure the class_id is set and is a valid number
if (isset($_POST['class_id']) && is_numeric($_POST['class_id'])) {
    $classId = $_POST['class_id'];

    try {
        // Prepare the DELETE statement
        $sql = "DELETE FROM Classes WHERE class_id = :class_id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':class_id', $classId, PDO::PARAM_INT);

        // Execute the statement
        $stmt->execute();

        // Check if any row was affected (class deleted)
        if ($stmt->rowCount() > 0) {
            echo json_encode(['status' => 'success', 'message' => 'Class deleted successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Class not found or already deleted']);
        }
    } catch (PDOException $e) {
        // Handle any errors during the database operation
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    // If class_id is not provided or is invalid
    echo json_encode(['status' => 'error', 'message' => 'Invalid or missing class_id']);
}
?>
