<?php
require '../db_connection.php'; // Include your database connection

header('Content-Type: application/json');

try {
    $stmt = $pdo->prepare("SELECT user_id, month FROM feeDetails WHERE status = 'paid'");
    $stmt->execute();
    $collectedFees = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $userId = $row['user_id'];
        $month = $row['month'];

        if (!isset($collectedFees[$userId])) {
            $collectedFees[$userId] = [];
        }
        $collectedFees[$userId][] = $month; // Store collected months for each student
    }

    echo json_encode($collectedFees);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
