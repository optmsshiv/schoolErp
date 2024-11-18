<?php
include '../db_connection.php'; // Include database connection file

// Fetch Fee Plans
$sql = "SELECT fp.class_name, fh.fee_head_name, fp.month, fp.fee_amount
        FROM FeePlans fp
        JOIN feeHeads fh ON fp.fee_head_id = fh.fee_head_id";

$stmt = $pdo->query($sql);
$fee_plans = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($fee_plans); // Return as JSON
?>
