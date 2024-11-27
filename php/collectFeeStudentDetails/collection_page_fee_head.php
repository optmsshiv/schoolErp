<?php
// Include database connection
include '../db_connection.php';

header('Content-Type: application/json');

// Get student roll_no or any identifying information (pass this via a request)
$roll_no = $_GET['roll_no'] ?? null;

if (!$roll_no) {
    echo json_encode(['status' => 'error', 'message' => 'Roll number is required']);
    exit;
}

try {
    // Fetch student-specific fees from FeePlans
    $sql = "SELECT fee_head_name, month_name, amount
            FROM FeePlans
            WHERE roll_no = :roll_no
            ORDER BY fee_head_name,
                     FIELD(month_name, 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March')";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['roll_no' => $roll_no]);

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['status' => 'success', 'data' => $data]);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
