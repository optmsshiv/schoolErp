<?php
require_once '../db_connection.php';

header('Content-Type: application/json');

// Get GET data from the request (you can filter by class, fee head, and/or month)
$className = $_GET['className'] ?? null;
$feeHead = $_GET['feeHead'] ?? null;
$month = $_GET['month'] ?? null;

// Build the SQL query dynamically based on provided filters
$sql = "SELECT * FROM FeePlans WHERE 1=1";
$params = [];
$types = '';

// Add conditions based on provided parameters
if ($className) {
    $sql .= " AND class_name = ?";
    $params[] = $className;
    $types .= 's'; // 's' means string
}

if ($feeHead) {
    $sql .= " AND fee_head_name = ?";
    $params[] = $feeHead;
    $types .= 's'; // 's' means string
}

if ($month) {
    $sql .= " AND month = ?";
    $params[] = $month;
    $types .= 's'; // 's' means string
}

// Prepare and execute the query
try {
    $stmt = $conn->prepare($sql);

    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    // Fetch all fee plans from the result
    $feePlans = [];
    while ($row = $result->fetch_assoc()) {
        $feePlans[] = $row;
    }

    // Return the fetched fee plans as a JSON response
    echo json_encode([
        'status' => 'success',
        'data' => $feePlans
    ]);
} catch (Exception $e) {
    // If there's an error, return the error message
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
} finally {
    // Close the statement and the database connection
    $stmt->close();
    $conn->close();
}
?>
