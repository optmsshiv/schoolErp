<?php
// Include database connection
include '../db_connection.php';

header('Content-Type: application/json');

try {
    // Get the class name from the request
    $className = isset($_GET['class_name']) ? $_GET['class_name'] : null;

    if (!$className) {
        echo json_encode(['status' => 'error', 'message' => 'Class name is required']);
        exit;
    }

    // Query to fetch fee plans data filtered by class name
    $sql = "SELECT fee_head_name, month_name, amount
            FROM FeePlans
            WHERE class_name = :class_name
            ORDER BY fee_head_name,
                     FIELD(month_name, 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March')";

    // Prepare and execute query
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':class_name', $className, PDO::PARAM_STR);
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
