<?php
// Include the database connection
include '../db_connection.php';  // $pdo is now available

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

// Validate input data
if (empty($data['hostelType']) || empty($data['hostelName']) || empty($data['hostelFee']) || empty($data['startDate']) || empty($data['userId'])) {
    echo json_encode(["status" => "error", "message" => "All fields are required."]);
    exit;
}

// Sanitize input
$hostelType = htmlspecialchars($data['hostelType']);
$hostelName = htmlspecialchars($data['hostelName']);
$hostelFee = (int)$data['hostelFee'];
$startDate = $data['startDate'];
$leaveDate = $data['leaveDate'];
$userId = (int)$data['userId'];  // User ID (student ID)
$createdAt = date("Y-m-d H:i:s");
$updatedAt = date("Y-m-d H:i:s");

try {
    // Step 1: Insert data into the hostels table
    $sql = "INSERT INTO hostels (hostel_type, hostel_name, hostel_fee, start_date, leave_date, created_at, updated_at)
            VALUES (:hostelType, :hostelName, :hostelFee, :startDate, :leaveDate, :createdAt, :updatedAt)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':hostelType' => $hostelType,
        ':hostelName' => $hostelName,
        ':hostelFee' => $hostelFee,
        ':startDate' => $startDate,
        ':leaveDate' => $leaveDate,
        ':createdAt' => $createdAt,
        ':updatedAt' => $updatedAt
    ]);

    // Get the hostel_id of the newly inserted hostel
    $hostelId = $pdo->lastInsertId();  // This retrieves the last inserted hostel_id

    // Step 2: Update the student record with the hostel_id
    $sqlUpdateStudent = "UPDATE students
                         SET hostel_id = :hostelId
                         WHERE user_id = :userId";
    $stmtUpdate = $pdo->prepare($sqlUpdateStudent);
    $stmtUpdate->execute([
        ':hostelId' => $hostelId,
        ':userId' => $userId
    ]);

    // Respond with success
    echo json_encode(["status" => "success", "message" => "Hostel details saved and assigned to the student successfully!"]);

} catch (PDOException $e) {
    // Log error to server logs
    error_log('Database error: ' . $e->getMessage(), 0);

    // Respond with a generic error
    http_response_code(500); // Internal Server Error
    echo json_encode(["status" => "error", "message" => "Failed to save hostel details. Please try again later."]);
}
?>
