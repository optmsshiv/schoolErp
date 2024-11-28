<?php
include '../db_connection.php';

header('Content-Type: application/json');

try {
    // Query to fetch distinct class names
    $sql = "SELECT DISTINCT class_name FROM FeePlans";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_COLUMN); // Fetch as an array of class names

    if (empty($data)) {
        echo json_encode(['status' => 'error', 'message' => 'No classes found.']);
    } else {
        echo json_encode(['status' => 'success', 'data' => $data]);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
