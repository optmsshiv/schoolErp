<?php
// Include the database connection
include '../db_connection.php';  // $pdo is now available

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

// Validate input data
if (empty($data['hostelType']) || empty($data['hostelName']) || empty($data['hostelFee']) || empty($data['startDate'])) {
    echo json_encode(["status" => "error", "message" => "All fields are required."]);
    exit;
}

// Sanitize input
$hostelType = htmlspecialchars($data['hostelType']);
$hostelName = htmlspecialchars($data['hostelName']);
$hostelFee = (float)$data['hostelFee'];
$startDate = $data['startDate'];
$leaveDate = $data['leaveDate'];
$createdAt = date("Y-m-d H:i:s");
$updatedAt = date("Y-m-d H:i:s");

try {
    // Insert data into the database
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

    // Respond with success
    echo json_encode(["status" => "success", "message" => "Hostel details saved successfully!"]);
} catch (PDOException $e) {
    // Log error to server logs
    error_log('Database error: ' . $e->getMessage(), 0);

    // Respond with a generic error
     http_response_code(500); // Internal Server Error
    echo json_encode(["status" => "error", "message" => "Failed to save hostel details. Please try again later."]);
}
?>
