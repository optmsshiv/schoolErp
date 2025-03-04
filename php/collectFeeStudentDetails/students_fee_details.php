<?php
require '../db_connection.php'; // Ensure your database connection is included

$user_id = $_GET['user_id']; // Get user_id from the request

$query = "
    SELECT
        receipt_no,
        month,
        due_amount,
        received_amount,
        total_amount,
        CASE
            WHEN received_amount > total_amount THEN received_amount - total_amount
            ELSE 0
        END AS advanced_amount,
        CASE
            WHEN received_amount >= total_amount THEN 0
            ELSE total_amount - received_amount
        END AS pending_amount,
        CASE
            WHEN received_amount >= total_amount THEN 'Paid'
            ELSE 'Pending'
        END AS status
    FROM
        feeDetails
    WHERE
        user_id = :user_id
";

$stmt = $pdo->prepare($query);
$stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
$stmt->execute();
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($data);
?>
