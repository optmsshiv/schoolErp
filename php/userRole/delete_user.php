<?php
// Include database connection
include '../db_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['user_id'])) {
    $user_id = $_POST['user_id'];

    try {
        $query = "DELETE FROM userRole WHERE user_id = :user_id";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            echo "success"; // Send success response
        } else {
            echo "error"; // Send error response
        }
    } catch (PDOException $e) {
        echo "error"; // Handle exception
    }
}
?>
