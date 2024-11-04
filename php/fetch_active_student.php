<?php
// Display all errors for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database configuration
$servername = "localhost";
$username = "edrppymy_admin";
$password = "13579@demo";
$dbname = "edrppymy_rrgis";
$port = 3306;

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

// Pagination and search parameters
$search = isset($_GET['search']) ? $_GET['search'] : '';
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
$offset = ($page - 1) * $limit;

// Prepare query with search term
$sql = "SELECT id, first_name, last_name, father_name, class_name, roll_no, phone, user_id
        FROM students
        WHERE CONCAT(first_name, ' ', last_name) LIKE ?
        LIMIT ?, ?";
$stmt = $conn->prepare($sql);
$searchTerm = "%$search%";
$stmt->bind_param("sii", $searchTerm, $offset, $limit);

$stmt->execute();
$result = $stmt->get_result();

$students = [];
while ($row = $result->fetch_assoc()) {
    $students[] = $row;
}

// Get total record count for pagination
$totalRecordsQuery = "SELECT COUNT(*) as total FROM students WHERE CONCAT(first_name, ' ', last_name) LIKE ?";
$totalStmt = $conn->prepare($totalRecordsQuery);
$totalStmt->bind_param("s", $searchTerm);
$totalStmt->execute();
$totalResult = $totalStmt->get_result();
$totalRecords = $totalResult->fetch_assoc()['total'];

// Set the content type to application/json
header('Content-Type: application/json');

// Return the JSON response with the fetched data and total records
echo json_encode([
    'students' => $students,
    'totalRecords' => $totalRecords
]);

// Close connection
$conn->close();
?>
