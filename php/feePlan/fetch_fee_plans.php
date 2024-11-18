<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once '../db_connection.php';

header('Content-Type: application/json');

try {
    $query = "
        SELECT
            fee_plan_id,
            fee_head_name,
            class_name,
            month_name,
            amount,
            created_at,
            updated_at
        FROM
            FeePlans
        ORDER BY
            class_name ASC, month_name ASC
    ";

    $result = $conn->query($query);

    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }

    $feePlans = [];
    while ($row = $result->fetch_assoc()) {
        $feePlans[] = $row;
    }

    echo json_encode([
        'status' => 'success',
        'data' => $feePlans
    ]);
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}

$conn->close();
?>
