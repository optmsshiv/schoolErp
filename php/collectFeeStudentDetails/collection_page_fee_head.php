<?php
// Include database connection
include '../db_connection.php';  // Assuming $pdo is the PDO connection

try {
    // Prepare the SQL query to fetch fee head, month name, and amount
    $sql = "SELECT fee_head_name, month_name, amount FROM FeePlans ORDER BY fee_head_name, FIELD(month_name, 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'March')";

    // Prepare the statement
    $stmt = $pdo->prepare($sql);

    // Execute the statement
    $stmt->execute();

    // Fetch all data
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return data as JSON array
    echo json_encode($data);

} catch (PDOException $e) {
    // Handle errors
    echo json_encode(['error' => $e->getMessage()]);
}
?>
