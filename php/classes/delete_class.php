<?php
// Include the database connection file
include '../db_connection.php';

header('Content-Type: application/json');

// Ensure the class_name is set and not empty
if (isset($_POST['class_name']) && !empty($_POST['class_name'])) {
    $className = trim($_POST['class_name']);

    try {
        // Prepare the DELETE statement
        $sql = "DELETE FROM Classes WHERE class_name = :class_name";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':class_name', $className, PDO::PARAM_STR);

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
    // If class_name is not provided or is empty
    echo json_encode(['status' => 'error', 'message' => 'Invalid or missing class_name']);
}
?>
