<?php
// Include the database connection
include '../db_connection.php';  // $pdo is now available

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

// Validate input
if (empty($data['userId']) || empty($data['hostelType']) || empty($data['hostelName']) || empty($data['hostelFee']) || empty($data['startDate'])) {
    echo json_encode(["status" => "error", "message" => "All fields are required."]);
    exit;
}

// Sanitize input
$userId = htmlspecialchars($data['userId']);
$hostelType = htmlspecialchars($data['hostelType']);
$hostelName = htmlspecialchars($data['hostelName']);
$hostelFee = (int)$data['hostelFee'];
$startDate = $data['startDate'];
$leaveDate = $data['leaveDate'] ?? null;

try {
    // Fetch current hostel_id for the student
    $hostelIdSql = "SELECT hostel_id FROM students WHERE user_id = :userId";
    $hostelIdStmt = $pdo->prepare($hostelIdSql);
    $hostelIdStmt->execute([':userId' => $userId]);
    $hostelId = $hostelIdStmt->fetchColumn();

    if (!$hostelId) {
        echo json_encode(["status" => "error", "message" => "No hostel found for this student."]);
        exit;
    }

    // Update hostel details
    $updateSql = "UPDATE hostels SET hostel_type = :hostelType, hostel_name = :hostelName, hostel_fee = :hostelFee, start_date = :startDate, leave_date = :leaveDate, updated_at = NOW() WHERE hostel_id = :hostelId";
    $updateStmt = $pdo->prepare($updateSql);
    $updateStmt->execute([
        ':hostelType' => $hostelType,
        ':hostelName' => $hostelName,
        ':hostelFee' => $hostelFee,
        ':startDate' => $startDate,
        ':leaveDate' => $leaveDate,
        ':hostelId' => $hostelId
    ]);

    echo json_encode(["status" => "success", "message" => "Hostel details updated successfully!"]);
} catch (PDOException $e) {
    error_log('Database error: ' . $e->getMessage(), 0);
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to update hostel details. Please try again later."]);
}
?>
