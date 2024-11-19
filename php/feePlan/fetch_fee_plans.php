<?php
// Include the database connection file
include '../db_connection.php';

header('Content-Type: application/json');

try {
    // Check if the ID parameter is provided
    $id = isset($_GET['id']) && !empty($_GET['id']) ? $_GET['id'] : null;

    if ($id) {
        // Fetch fee plan by ID
        $sql = "SELECT fee_head_name, class_name, month_name, amount, created_at FROM FeePlans WHERE fee_plan_id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        $feePlan = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($feePlan) {
            // Return success response with the specific fee plan
            echo json_encode(['status' => 'success', 'data' => $feePlan]);
        } else {
            // ID provided but no record found
            echo json_encode(['status' => 'success', 'data' => [], 'message' => 'No fee plan found for the given ID']);
        }
    } else {
        // Fetch all fee plans if no ID is provided
        $sql = "SELECT fee_head_name, class_name, month_name, amount, created_at FROM FeePlans ORDER BY class_name";
        $stmt = $pdo->query($sql);

        $feePlans = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($feePlans) {
            // Return success response with all fee plans
            echo json_encode(['status' => 'success', 'data' => $feePlans]);
        } else {
            // No fee plans found
            echo json_encode(['status' => 'success', 'data' => [], 'message' => 'No fee plans found']);
        }
    }
} catch (PDOException $e) {
    // Log the error (for debugging purposes)
    error_log('Database error: ' . $e->getMessage());

    // Return error response
    echo json_encode(['status' => 'error', 'message' => 'Database error. Please try again later.']);
}
?>
