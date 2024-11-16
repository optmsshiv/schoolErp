<?php
// Include the database connection file
include '../db_connection.php';

header('Content-Type: application/json');

// Ensure both class_id and class_name are set and valid
if (isset($_POST['class_id']) && is_numeric($_POST['class_id']) && isset($_POST['class_name']) && !empty($_POST['class_name'])) {
    $classId = $_POST['class_id'];
    $className = trim($_POST['class_name']);

    try {
        // Prepare the UPDATE statement
        $sql = "UPDATE Classes SET class_name = :class_name WHERE class_id = :class_id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':class_name', $className, PDO::PARAM_STR);
        $stmt->bindParam(':class_id', $classId, PDO::PARAM_INT);

        // Execute the statement
        $stmt->execute();

        // Check if any row was affected (class updated)
        if ($stmt->rowCount() > 0) {
            echo json_encode(['status' => 'success', 'message' => 'Class updated successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Class not found or no changes made']);
        }
    } catch (PDOException $e) {
        // Handle any errors during the database operation
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    // If class_id or class_name is not provided or invalid
    echo json_encode(['status' => 'error', 'message' => 'Invalid or missing class_id or class_name']);
}
?>
