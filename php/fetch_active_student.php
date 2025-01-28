<?php
// Display all errors for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include the database connection
include '../php/db_connection.php'; // Using PDO connection from db_connection.php

// Fetch class names from the 'Classes' table
$classQuery = "SELECT class_name FROM Classes";
$classResult = $pdo->query($classQuery);

$classes = [];
if ($classResult->rowCount() > 0) {
    while ($row = $classResult->fetch()) {
        $classes[] = $row['class_name'];
    }
}

// Pagination, search, sorting, and class parameters
$search = isset($_GET['search']) ? $_GET['search'] : '';
$class = isset($_GET['class']) ? $_GET['class'] : ''; // Class filter
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
$offset = ($page - 1) * $limit;
$sortColumn = isset($_GET['sortColumn']) ? $_GET['sortColumn'] : 'id'; // Default sort column
$sortOrder = isset($_GET['sortOrder']) && in_array(strtoupper($_GET['sortOrder']), ['ASC', 'DESC'])
    ? strtoupper($_GET['sortOrder'])
    : 'ASC'; // Default sort order

// Validate sort column to prevent SQL injection
$allowedColumns = ['id', 'first_name', 'last_name', 'father_name', 'class_name', 'roll_no', 'phone', 'user_id', 'status'];
if (!in_array($sortColumn, $allowedColumns)) {
    $sortColumn = 'id'; // Fallback to a safe column
}

// Prepare query with search term, class filter, and sorting
$sql = "SELECT id, first_name, last_name, father_name, class_name, roll_no, phone, user_id, status
        FROM students
        WHERE CONCAT(first_name, ' ', last_name) LIKE :search";

if (!empty($class) && $class !== "All") {
    $sql .= " AND class_name = :class";
}

// Add sorting
$sql .= " ORDER BY $sortColumn $sortOrder";

// Add pagination
$sql .= " LIMIT :offset, :limit";

$stmt = $pdo->prepare($sql);

// Bind parameters
$searchTerm = "%$search%";
$stmt->bindParam(':search', $searchTerm, PDO::PARAM_STR);

if (!empty($class) && $class !== "All") {
    $stmt->bindParam(':class', $class, PDO::PARAM_STR);
}

$stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
$stmt->bindParam(':limit', $limit, PDO::PARAM_INT);

$stmt->execute();
$students = $stmt->fetchAll();

// Get total record count for pagination with class filtering
$totalRecordsQuery = "SELECT COUNT(*) as total FROM students WHERE CONCAT(first_name, ' ', last_name) LIKE :search";

if (!empty($class) && $class !== "All") {
    $totalRecordsQuery .= " AND class_name = :class";
}

$totalStmt = $pdo->prepare($totalRecordsQuery);
$totalStmt->bindParam(':search', $searchTerm, PDO::PARAM_STR);

if (!empty($class) && $class !== "All") {
    $totalStmt->bindParam(':class', $class, PDO::PARAM_STR);
}

$totalStmt->execute();
$totalResult = $totalStmt->fetch(PDO::FETCH_ASSOC);
$totalRecords = $totalResult['total'];

// Set the content type to application/json
header('Content-Type: application/json');

// Return the JSON response with the fetched data, total records, and available classes
echo json_encode([
    'students' => $students,
    'totalRecords' => $totalRecords,
    'classes' => $classes // Added the classes to the response
]);

// Close the PDO connection (not strictly necessary, but a good practice)
$pdo = null;

