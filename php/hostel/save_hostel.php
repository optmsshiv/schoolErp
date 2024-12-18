<?php
// Database connection
// Include the database connection
include '../db_connection.php';  // $pdo is now available from db_connection.php

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    exit;
}

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

$hostelType = $data['hostelType'];
$hostelName = $data['hostelName'];
$hostelFee = $data['hostelFee'];
$startDate = $data['startDate'];
$leaveDate = $data['leaveDate'];
$createdAt = date("Y-m-d H:i:s");
$updatedAt = date("Y-m-d H:i:s");

try {
    $sql = "INSERT INTO hostels (hostel_type, hostel_name, hostel_fee, start_date, leave_date, created_at, updated_at)
            VALUES (:hostelType, :hostelName, :hostelFee, :startDate, :leaveDate, :createdAt, :updatedAt)";
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':hostelType' => $hostelType,
        ':hostelName' => $hostelName,
        ':hostelFee' => $hostelFee,
        ':startDate' => $startDate,
        ':leaveDate' => $leaveDate,
        ':createdAt' => $createdAt,
        ':updatedAt' => $updatedAt
    ]);
    echo json_encode(["status" => "success", "message" => "Hostel details saved successfully!"]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
