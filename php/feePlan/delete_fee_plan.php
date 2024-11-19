<?php
// Include database connection file
include '../db_connection.php';

header('Content-Type: application/json');

try {
    // Get class_name from the POST request
    $className = $_POST['className'] ?? null;

    if ($className) {
        // Delete fee plans by class_name
        $sql = "DELETE FROM FeePlans WHERE class_name = :className";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':className', $className, PDO::PARAM_STR);

        if ($stmt->execute()) {
            // Check how many rows were deleted
            $rowsDeleted = $stmt->rowCount();
            if ($rowsDeleted > 0) {
                echo json_encode(['status' => 'success', 'message' => "$rowsDeleted fee plans for class '$className' deleted successfully."]);
            } else {
                echo json_encode(['status' => 'error', 'message' => "No fee plans found for class '$className'."]);
            }
        } else {
            throw new Exception('Failed to delete fee plans. Please try again.');
        }
    } else {
        // Handle missing class_name
        echo json_encode(['status' => 'error', 'message' => 'Class name is required to delete fee plans.']);
    }
} catch (Exception $e) {
    // Log the error and return a generic error message
    error_log('Error: ' . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'An error occurred while deleting fee plans. Please try again later.']);
}
?>
