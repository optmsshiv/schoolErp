<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

// Include the database connection file
require '../db_connection.php'; // Make sure this path is correct

try {
    // SQL Query to fetch fee plans
    $sql = "
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

    // Execute query
    $stmt = $pdo->query($sql);

    // Fetch all records
    $feePlans = $stmt->fetchAll();

    // Return data in JSON format
    echo json_encode([
        'status' => 'success',
        'data' => $feePlans
    ]);
} catch (PDOException $e) {
    // Handle PDO exception
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>
