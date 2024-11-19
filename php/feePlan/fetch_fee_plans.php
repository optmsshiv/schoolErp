<?php
// Include the database connection file
include '../db_connection.php';

header('Content-Type: application/json');

try {
    // Check if ID is provided in the request
    if (!isset($_GET['id']) || empty($_GET['id'])) {
        echo json_encode(['status' => 'error', 'message' => 'ID parameter is missing']);
        exit;
    }

    // Sanitize the input ID
    $id = intval($_GET['id']);

    // Fetch the fee plan by ID
    $sql = "SELECT fee_head_name, class_name, month_name, amount, created_at
            FROM FeePlans
            WHERE fee_plan_id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    // Fetch the fee plan
    $feePlan = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($feePlan) {
        // Return success response with the fee plan data
        echo json_encode(['status' => 'success', 'data' => $feePlan]);
    } else {
        // Return success response but no data found
        echo json_encode(['status' => 'success', 'data' => [], 'message' => 'Fee plan not found']);
    }
} catch (PDOException $e) {
    // Log the error (instead of displaying it) for security reasons
    error_log('Database error: ' . $e->getMessage());

    // Return error response
    echo json_encode(['status' => 'error', 'message' => 'Database error. Please try again later.']);
}
?>
