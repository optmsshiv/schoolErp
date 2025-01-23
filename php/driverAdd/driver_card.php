<?php
// Include the database connection
include '../db_connection.php';

header('Content-Type: application/json');

try {
    // Query to get the total number of drivers
    $sql = "SELECT COUNT(*) AS total_drivers FROM school_driver";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    // Fetch the result
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $total_drivers = $result['total_drivers'] ?? 0;

    // Return the count as JSON
    echo json_encode(['total_drivers' => $total_drivers]);

} catch (PDOException $e) {
    // Handle errors
    echo json_encode(['error' => $e->getMessage()]);
}
?>
