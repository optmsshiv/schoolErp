<?php
require_once '../db_connection.php';

header('Content-Type: application/json');

// Get the fee plan ID from the request
$feePlanId = $_GET['id'] ?? null;

if (!$feePlanId) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Fee plan ID is required.'
    ]);
    exit;
}

try {
    // Fetch the specific fee plan data
    $sql = "SELECT * FROM FeePlans WHERE fee_plan_id = :feePlanId";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':feePlanId', $feePlanId, PDO::PARAM_INT);
    $stmt->execute();

    $feePlan = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($feePlan) {
        echo json_encode([
            'status' => 'success',
            'data' => $feePlan
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Fee plan not found.'
        ]);
    }
} catch (Exception $e) {
    error_log('Error: ' . $e->getMessage());
    echo json_encode([
        'status' => 'error',
        'message' => 'An error occurred while fetching the fee plan data.'
    ]);
}
?>
