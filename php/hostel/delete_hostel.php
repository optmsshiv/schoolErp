<?php
// Include the database connection
include '../db_connection.php';  // $pdo is now available

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

// Validate input
if (empty($data['userId'])) {
    echo json_encode(["status" => "error", "message" => "Student ID is required."]);
    exit;
}

$userId = htmlspecialchars($data['userId']);

try {
    // Remove hostel assignment from student
    $removeHostelSql = "UPDATE students SET hostel_id = NULL WHERE user_id = :userId";
    $removeHostelStmt = $pdo->prepare($removeHostelSql);
    $removeHostelStmt->execute([':userId' => $userId]);

    echo json_encode(["status" => "success", "message" => "Hostel removed successfully!"]);
} catch (PDOException $e) {
    error_log('Database error: ' . $e->getMessage(), 0);
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to remove hostel. Please try again later."]);
}
?>
