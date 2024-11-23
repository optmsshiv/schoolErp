<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include the database connection
include '../db_connection.php';  // $pdo is now available from db_connection.php

try {
    // Get the search query from the request
    $search = $_GET['query'] ?? '';

    // Prepare the SQL statement
    $sql = "SELECT first_name, last_name, father_name, class_name, roll_no
            FROM students
            WHERE first_name LIKE :search OR father_name LIKE :search
            LIMIT 10";

    // Prepare the statement using the $pdo connection
    $stmt = $pdo->prepare($sql);

    // Bind the parameter for the search term
    $searchTerm = '%' . $search . '%';
    $stmt->bindParam(':search', $searchTerm, PDO::PARAM_STR);

    // Execute the prepared statement
    $stmt->execute();

    // Fetch results as an associative array
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return the results as a JSON response
    echo json_encode($data);

} catch (PDOException $e) {
    // In case of an error, output the error message in JSON format
    echo json_encode(['error' => $e->getMessage()]);
}
?>
