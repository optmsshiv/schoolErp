<?php
// Include database connection
include '../db_connection.php';

header('Content-Type: application/json');

try {
    // Get the class_name from the request
    $class_name = $_POST['class_name'] ?? '';

    if (empty($class_name)) {
        echo json_encode(['status' => 'error', 'message' => 'Class name not provided.']);
        exit;
    }

    // Query to fetch fee plans data filtered by class_name
    $sql = "SELECT fee_head_name, month_name, amount
            FROM FeePlans
            WHERE class_name = :class_name
            ORDER BY fee_head_name,
                     FIELD(month_name, 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March')";

    // Prepare and execute the query
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['class_name' => $class_name]);

    // Fetch all rows
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($data)) {
        echo json_encode(['status' => 'error', 'message' => 'No data found for the provided class.']);
        exit;
    }

    // Return the data as JSON
    echo json_encode(['status' => 'success', 'data' => $data]);
} catch (PDOException $e) {
    // Return error details
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
