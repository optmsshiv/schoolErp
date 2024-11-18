<?php
require_once '../db_connection.php';

header('Content-Type: application/json');

// Get GET data from the request (you can filter by class, fee head, and/or month)
$className = $_GET['className'] ?? null;
$feeHead = $_GET['feeHead'] ?? null;
$month = $_GET['month'] ?? null;

$sql = "SELECT * FROM FeePlans WHERE 1=1";
$params = [];
$queryParams = [];

// Add conditions based on provided parameters
if ($className) {
    $sql .= " AND class_name = :class_name";
    $params[':class_name'] = $className;
}

if ($feeHead) {
    $sql .= " AND fee_head_name = :fee_head_name";
    $params[':fee_head_name'] = $feeHead;
}

if ($month) {
    $sql .= " AND month_name = :month_name";
    $params[':month_name'] = $month;
}

try {
    // Prepare the SQL statement
    $stmt = $conn->prepare($sql);

    // Bind parameters
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value, PDO::PARAM_STR);
    }

    // Execute the statement
    $stmt->execute();

    // Fetch the fee plans as an associative array
    $feePlans = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return the fetched fee plans as a JSON response
    echo json_encode([
        'status' => 'success',
        'data' => $feePlans
    ]);
} catch (PDOException $e) {
    // If there's an error, return the error message
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} finally {
    // Close the database connection (PDO handles connection management automatically)
    $conn = null;
}
?>
