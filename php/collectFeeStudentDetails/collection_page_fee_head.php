<?php
include '../db_connection.php';

header('Content-Type: application/json');

$class_name = $_GET['class_name'] ?? null;

try {
    if ($class_name) {
        // Query to fetch fee plans for the specific class
        $sql = "SELECT fee_head_name, month_name, amount
                FROM FeePlans
                WHERE class_name = :class_name
                ORDER BY fee_head_name,
                         FIELD(month_name, 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March')";

        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':class_name', $class_name, PDO::PARAM_STR);
        $stmt->execute();

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!empty($data)) {
            echo json_encode(['status' => 'success', 'data' => $data]);
            exit;
        }
    }

    // If no data is found for the class, fetch the distinct class names
    $sql = "SELECT DISTINCT class_name FROM FeePlans";
    $stmt = $pdo->query($sql);
    $classNames = $stmt->fetchAll(PDO::FETCH_COLUMN);

    $missingClassName = $classNames ? implode(', ', $classNames) : $class_name;

    echo json_encode(['status' => 'error', 'missingClassName' => $missingClassName]);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
