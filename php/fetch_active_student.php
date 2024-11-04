<?php
include 'db_connection.php';

$search = isset($_GET['search']) ? $_GET['search'] : '';
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
$start = ($page - 1) * $limit;

// Prepare the SQL query with the search term if provided
$sql = "SELECT * FROM students WHERE CONCAT(first_name, ' ', last_name) LIKE ? LIMIT ?, ?";
$stmt = $conn->prepare($sql);
$searchTerm = "%$search%";
$stmt->bind_param("sii", $searchTerm, $start, $limit);

$stmt->execute();
$result = $stmt->get_result();

$students = [];
while ($row = $result->fetch_assoc()) {
    $students[] = $row;
}

// Total records for pagination
$totalRecordsQuery = "SELECT COUNT(*) as total FROM students WHERE CONCAT(first_name, ' ', last_name) LIKE ?";
$totalStmt = $conn->prepare($totalRecordsQuery);
$totalStmt->bind_param("s", $searchTerm);
$totalStmt->execute();
$totalResult = $totalStmt->get_result();
$totalRecords = $totalResult->fetch_assoc()['total'];

echo json_encode([
  'students' => $students,
  'totalRecords' => $totalRecords
]);
?>
