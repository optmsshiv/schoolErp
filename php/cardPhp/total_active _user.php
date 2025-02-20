<?php
// Include the database connection
include '../db_connection.php';

header('Content-Type: application/json');

try {
    // Query to get the total number of drivers
    // SELECT COUNT(*) AS total_drivers FROM school_driver WHERE driver_status = 'active'; (when need to show only active driver)

    $sql = "SELECT COUNT(*) AS total_users FROM userRole"; //show all driver include active and inactive
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    // Fetch the result
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $total_users = $result['total_users'] ?? 0;

    // Return the count as JSON
    echo json_encode(['total_users' => $total_users]);

} catch (PDOException $e) {
    // Handle errors
    echo json_encode(['error' => $e->getMessage()]);
}
?>
