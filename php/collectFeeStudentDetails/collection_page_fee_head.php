<?php
// Include database connection
include '../db_connection.php';

header('Content-Type: application/json');

try {
    // Query to fetch fee plans data sorted by Fee Head and custom month order
    $sql = "SELECT fee_head_name, month_name, amount
            FROM FeePlans
            WHERE amount IS NOT NULL AND amount != ''
            ORDER BY fee_head_name,
                     FIELD(month_name, 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March')";

    // Execute the query
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    // Fetch all rows
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return the data as JSON
    echo json_encode(['status' => 'success', 'data' => $data]);
} catch (PDOException $e) {
    // Return error details
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
