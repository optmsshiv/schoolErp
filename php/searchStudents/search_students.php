<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include the database connection
include '../db_connection.php';  // $pdo is now available from db_connection.php

try {
    // Get the search query from the request
    $search = $_GET['query'] ?? '';

    // Prepare the SQL statement with JOINs
    $sql = "SELECT
                s.first_name,
                s.last_name,
                s.father_name,
                s.class_name,
                s.roll_no,
                s.mother_name,
                s.phone,
                s.gender,
                s.day_hosteler AS type,
                f.amount AS monthly_fee,
                h.hostel_fee,
                t.transport_fee
            FROM
                students s
            LEFT JOIN
                FeePlans f
            ON
                s.class_name = f.class_name
            LEFT JOIN
                hostels h
            ON
                s.hostel_id = h.hostel_id
            LEFT JOIN
                transport t
            ON
                s.transport_id = t.transport_id
            WHERE
                s.first_name LIKE :search OR
                s.father_name LIKE :search
            LIMIT 15";

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
