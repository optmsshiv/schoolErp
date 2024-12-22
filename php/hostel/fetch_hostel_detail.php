<?php
include '../db_connection.php';

// Get the user_id from the request
$data = json_decode(file_get_contents("php://input"), true);
$userId = isset($data['userId']) ? $data['userId'] : null;

if (!$userId) {
    echo json_encode(["status" => "error", "message" => "User ID is required."]);
    exit;
}

try {
    $sql = "SELECT
                students.user_id AS student_id,
                CONCAT(students.first_name, ' ', students.last_name) AS student_name,
                hostels.hostel_name,
                hostels.hostel_fee,
                hostels.start_date,
                hostels.leave_date
            FROM students
            LEFT JOIN hostels ON students.hostel_id = hostels.hostel_id
            WHERE students.user_id = :userId";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':userId', $userId, PDO::PARAM_STR);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($result as &$row) {
    $row['start_date'] = date('d-m-Y', strtotime($row['start_date']));
    $row['leave_date'] = $row['leave_date'] ? date('d-m-Y', strtotime($row['leave_date'])) : null;
}

    if ($result) {
        echo json_encode(["status" => "success", "data" => $result]);
    } else {
        echo json_encode(["status" => "error", "message" => "No hostel details found for the given student."]);
    }
} catch (PDOException $e) {
    error_log('Fetch hostel details error: ' . $e->getMessage(), 0);
    echo json_encode(["status" => "error", "message" => "Failed to fetch hostel details."]);
}
?>
