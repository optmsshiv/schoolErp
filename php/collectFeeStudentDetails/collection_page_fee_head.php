<?php
// Include database connection
include '../db_connection.php';  // Ensure this points to your connection file

try {
    // Prepare SQL query to fetch fee plans data
    $sql = "SELECT fee_head_name, month_name, amount
            FROM FeePlans
            ORDER BY fee_head_name, FIELD(month_name, 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'March')";

    // Execute query
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    // Fetch all rows
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return as JSON array
    echo json_encode($data);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
