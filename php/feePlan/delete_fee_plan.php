<?php
// Include the database connection file
include '../db_connection.php';

header('Content-Type: application/json');

try {
    // Get the class_name from the POST data
    $className = isset($_POST['class_name']) ? $_POST['class_name'] : null;

    if (!$className) {
        echo json_encode(['status' => 'error', 'message' => 'Class name is required to delete a fee plan.']);
        exit;
    }

    // Delete fee plans based on class_name
    $sql = "DELETE FROM FeePlans WHERE class_name = :class_name";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':class_name', $className, PDO::PARAM_STR);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Fee plan deleted successfully.']);
    } else {
        throw new Exception('Failed to delete fee plan.');
    }
} catch (Exception $e) {
    error_log('Error: ' . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'An error occurred while deleting the fee plan.']);
}
?>
