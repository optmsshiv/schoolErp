<?php
// Include database connection
include '../db_connection.php';  // Assuming $pdo is the PDO connection

try {
    // Prepare the SQL query to fetch fee head, month name, and amount
    $sql = "SELECT fee_head_name, month_name, amount FROM FeePlans";

    // Prepare the statement
    $stmt = $pdo->prepare($sql);

    // Execute the statement
    $stmt->execute();

    // Fetch all data
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Structure the data by fee head
    $structuredData = [];

    // Loop through each record and group by fee_head_name
    foreach ($data as $record) {
        $structuredData[$record['fee_head_name']][$record['month_name']] = $record['amount'];
    }

    // Return structured data as JSON
    echo json_encode($structuredData);

} catch (PDOException $e) {
    // Handle errors
    echo json_encode(['error' => $e->getMessage()]);
}
?>
