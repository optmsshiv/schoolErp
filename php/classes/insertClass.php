<?php
// Include the database connection file
include '../db_connection.php';

header('Content-Type: application/json');

try {
    // Ensure $pdo is defined for PDO use
    if (!isset($pdo)) {
        throw new Exception("Database connection not established");
    }

    // Check if the request method is POST
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Check if className is set and not empty
        if (!empty($_POST['className'])) {
            $className = trim($_POST['className']);

            try {
                // Prepare the SQL statement
                $sql = "INSERT INTO Classes (class_name) VALUES (:class_name)";
                $stmt = $pdo->prepare($sql);
                $stmt->bindParam(':class_name', $className, PDO::PARAM_STR);

                // Execute the statement
                $stmt->execute();

                // Respond with success
                http_response_code(201); // 201 Created
                echo json_encode(['status' => 'success', 'message' => 'Class added successfully']);
            } catch (PDOException $e) {
                // Handle duplicate entry error
                if ($e->getCode() == 23000) { // Integrity constraint violation
                    http_response_code(409); // 409 Conflict
                    echo json_encode(['status' => 'error', 'message' => 'Class name already exists']);
                } else {
                    http_response_code(500); // 500 Internal Server Error
                    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
                }
            }
        } else {
            // Respond with validation error
            http_response_code(400); // 400 Bad Request
            echo json_encode(['status' => 'error', 'message' => 'Class name cannot be empty']);
        }
    } else {
        // Respond with method not allowed
        http_response_code(405); // 405 Method Not Allowed
        echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    }
} catch (Exception $e) {
    // Handle general exceptions
    http_response_code(500); // 500 Internal Server Error
    echo json_encode(['status' => 'error', 'message' => 'Server error: ' . $e->getMessage()]);
}
