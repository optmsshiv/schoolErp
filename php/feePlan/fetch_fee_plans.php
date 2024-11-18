<?php
include '../db_connection.php';

header('Content-Type: application/json');

// Get the GET parameters for filtering
$className = $_GET['className'] ?? null;
$feeHead = $_GET['feeHead'] ?? null;
$month = $_GET['month'] ?? null;

$sql = "SELECT * FROM FeePlans WHERE 1=1";  // Start with a base query
$params = [];

// Add conditions for filters if provided
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
    // Prepare and execute the SQL statement
    $stmt = $conn->prepare($sql);

    // Bind parameters dynamically
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value, PDO::PARAM_STR);
    }

    $stmt->execute();

    // Fetch all results
    $feePlans = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return the fee plans as JSON
    echo json_encode([
        'status' => 'success',
        'data' => $feePlans
    ]);
} catch (PDOException $e) {
    // Handle any errors
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} finally {
    // Close the connection (PDO handles it automatically)
    $conn = null;
}
?>
