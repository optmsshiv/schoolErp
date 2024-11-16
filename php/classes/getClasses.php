<?php
// Include the database connection file
include '../php/db_connection.php';

header('Content-Type: application/json');

try {
    // Fetch all classes
    $sql = "SELECT class_id, class_name FROM Classes ORDER BY class_name";
    $stmt = $pdo->query($sql);

    $classes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['status' => 'success', 'data' => $classes]);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
