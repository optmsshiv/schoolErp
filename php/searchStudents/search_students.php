<?php
// Database connection
include '../db_connection.php'; // Ensure this file establishes a PDO connection in $conn

try {
    // Get the search query
    $search = $_GET['query'] ?? '';

    // Prepare the SQL statement
    $sql = "SELECT first_name, last_name, father_name, class_name, roll_no
            FROM students
            WHERE first_name LIKE :search OR father_name LIKE :search
            LIMIT 10";
    $stmt = $conn->prepare($sql);

    // Bind the parameter
    $searchTerm = '%' . $search . '%';
    $stmt->bindParam(':search', $searchTerm, PDO::PARAM_STR);

    // Execute the statement
    $stmt->execute();

    // Fetch results
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return the results as JSON
    echo json_encode($data);
} catch (PDOException $e) {
    // Handle potential errors
    echo json_encode(['error' => $e->getMessage()]);
}
?>
