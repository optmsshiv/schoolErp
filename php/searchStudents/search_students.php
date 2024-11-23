<?php
// Database connection
include '../db_connection.php';
// Get the data from the form

$search = $_GET['query'] ?? '';
$sql = "SELECT id, first_name, last_name, father_name, class_name, roll_no FROM students
        WHERE first_name LIKE ? OR father_name LIKE ? LIMIT 10";
$stmt = $conn->prepare($sql);
$searchTerm = "%" . $search . "%";
$stmt->bind_param("ss", $searchTerm, $searchTerm);
$stmt->execute();
$result = $stmt->get_result();

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);

$stmt->close();
$conn->close();
?>
