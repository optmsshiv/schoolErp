<?php
include '../db_connection.php';

try {
    // Get class_name from the request
    $class_name = $_GET['class_name'] ?? '';

    $sql = "SELECT fee_head_name, month_name, amount
            FROM FeePlans
            WHERE class_name = :class_name
            ORDER BY fee_head_name,
                     FIELD(month_name, 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'March')";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':class_name', $class_name, PDO::PARAM_STR);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($data);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
