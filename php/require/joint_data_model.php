<?php
include '../db_connection.php'; // Ensure database connection is included

$user_id = $_GET['user_id'] ?? '';

if (!empty($user_id)) {
    $stmt = $pdo->prepare("
        SELECT
            CONCAT(s.first_name, ' ', s.last_name) AS student_name,
            s.father_name,
            s.class_name,
            f.fee_type,
            f.received_amount AS last_paid_amount,
            f.payment_date AS last_paid_date
        FROM feeDetails f
        JOIN students s ON f.user_id = s.user_id
        WHERE f.user_id = :user_id
        ORDER BY f.payment_date DESC
        LIMIT 1
    ");
    $stmt->execute(['user_id' => $user_id]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode($data);
}
?>
