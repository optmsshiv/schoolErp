<?php
// Include database connection
include '../db_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['user_id'])) {
    $user_id = $_POST['user_id'];

    try {
        // Debug: Log user_id to make sure it's correct
        error_log("Deleting user with ID: " . $user_id);

        // Correct DELETE statement: Ensure the query targets the correct user_id
        $query = "DELETE FROM userRole WHERE user_id = :user_id";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            echo "success"; // Send success response
        } else {
            echo "error"; // Send error response
        }
    } catch (PDOException $e) {
        // Log the exception message for debugging
        error_log("PDOException: " . $e->getMessage());
        echo "error"; // Handle exception
    }
}

?>
