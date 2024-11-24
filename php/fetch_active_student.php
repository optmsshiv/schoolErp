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

// Fetch class names from the 'Classes' table
$classQuery = "SELECT class_name FROM Classes";
$classResult = $conn->query($classQuery);

$classes = [];
if ($classResult->num_rows > 0) {
    while ($row = $classResult->fetch_assoc()) {
        $classes[] = $row['class_name'];
}

// Pagination and search parameters
$search = isset($_GET['search']) ? $_GET['search'] : '';
$class = isset($_GET['class']) ? $_GET['class'] : ''; // New class parameter
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
$offset = ($page - 1) * $limit;

// Prepare query with search term and class filter
$sql = "SELECT id, first_name, last_name, father_name, class_name, roll_no, phone, user_id
        FROM students
        WHERE CONCAT(first_name, ' ', last_name) LIKE ?";

if (!empty($class) && $class !== "All") {
    $sql .= " AND class_name = ?";
}

$sql .= " LIMIT ?, ?";

$stmt = $conn->prepare($sql);

// Check if statement preparation succeeded
if (!$stmt) {
    die(json_encode(['error' => 'Query preparation failed: ' . $conn->error]));
}

$searchTerm = "%$search%";
$params = [$searchTerm];

if (!empty($class) && $class !== "All") {
    $params[] = $class; // Add class to parameters
}

$params[] = $offset;
$params[] = $limit;

// Prepare dynamic binding types
$types = "s"; // String type for search term
if (!empty($class) && $class !== "All") {
    $types .= "s"; // Add string type for class
}
$types .= "ii"; // Two integer types for offset and limit

// Bind parameters dynamically
$stmt->bind_param($types, ...$params);

$stmt->execute();
$result = $stmt->get_result();

$students = [];
while ($row = $result->fetch_assoc()) {
    $students[] = $row;
}

// Get total record count for pagination with class filtering
$totalRecordsQuery = "SELECT COUNT(*) as total FROM students WHERE CONCAT(first_name, ' ', last_name) LIKE ?";

if (!empty($class) && $class !== "All") {
    $totalRecordsQuery .= " AND class_name = ?";
}

$totalStmt = $conn->prepare($totalRecordsQuery);

if (!$totalStmt) {
    die(json_encode(['error' => 'Total records query preparation failed: ' . $conn->connect_error]));
}

$totalParams = [$searchTerm];
if (!empty($class) && $class !== "All") {
    $totalParams[] = $class; // Add class to total query parameters
}

// Prepare dynamic binding types for total records
$totalTypes = "s";
if (!empty($class) && $class !== "All") {
    $totalTypes .= "s"; // Add string type for class
}

// Bind parameters dynamically for total records
$totalStmt->bind_param($totalTypes, ...$totalParams);

$totalStmt->execute();
$totalResult = $totalStmt->get_result();
$totalRecords = $totalResult->fetch_assoc()['total'];

// Set the content type to application/json
header('Content-Type: application/json');

// Return the JSON response with the fetched data, total records, and available classes
echo json_encode([
    'students' => $students,
    'totalRecords' => $totalRecords,
    'classes' => $classes // Added the classes to the response
]);

// Close statements and connection
$stmt->close();
$totalStmt->close();
$conn->close();
?>
