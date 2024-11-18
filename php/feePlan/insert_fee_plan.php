<?php
include '../db_connection.php'; // Include database connection file

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Get the form data
        $fee_head_name = $_POST['feeHeadSelect'];
        $class_name = $_POST['class'];
        $month = $_POST['month'];
        $fee_amount = $_POST['feeAmount'];

        // Insert into the fee plan table
        $sql = "INSERT INTO FeePlans (fee_head_name, class_name, month, fee_amount)
                VALUES (:fee_head_name, :class_name, :month, :fee_amount)";

        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':fee_head_name', $fee_head_name);
        $stmt->bindParam(':class_name', $class_name);
        $stmt->bindParam(':month', $month);
        $stmt->bindParam(':fee_amount', $fee_amount);

        $stmt->execute();

        echo "Fee plan created successfully!";
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}
?>
