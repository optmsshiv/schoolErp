<?php
include '../db_connection.php'; // Include your database connection

ini_set('display_errors', 1);
error_reporting(E_ALL);

// Check if the user_id parameter is present in the query string
if (isset($_GET['user_id'])) {
    $user_id = $_GET['user_id'];

    // Check if the user_id is not empty
    if (empty($user_id)) {
        echo json_encode(["error" => "Invalid user_id"]);
        exit();
    }

    try {
        // Use PDO to prepare and execute the query
        $sql = "SELECT * FROM students WHERE user_id = :user_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_STR);
        $stmt->execute();

        // Check if the student exists in the database
        if ($stmt->rowCount() > 0) {
            $student = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($student); // Return student data as JSON
        } else {
            echo json_encode(["error" => "Student not found"]);
        }
    } catch (PDOException $e) {
        // Handle any errors during database operations
        echo json_encode(["error" => "Error fetching student data: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "No user_id provided"]);
}
?>
