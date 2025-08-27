<?php
// Include DB connection
include '../db_connection.php';

header('Content-Type: application/json');

try {
  // Get parameters
  $table = isset($_GET['table']) ? $_GET['table'] : null;
  $column = isset($_GET['column']) ? $_GET['column'] : null;

  if (!$table || !$column) {
    echo json_encode(['status' => 'error', 'message' => 'Missing parameters.']);
    exit;
  }

  // Security: allow only specific tables/columns
  $allowedTables = [
    'Classes' => 'class_name',
    'FeeHeads' => 'fee_head_name'
  ];

  if (!array_key_exists($table, $allowedTables) || $allowedTables[$table] !== $column) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request.']);
    exit;
  }

  // Fetch values
  $sql = "SELECT DISTINCT $column FROM $table ORDER BY $column ASC";
  $stmt = $pdo->query($sql);
  $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode(['status' => 'success', 'data' => $data]);

} catch (PDOException $e) {
  error_log("Database Error: " . $e->getMessage());
  echo json_encode(['status' => 'error', 'message' => 'Database error.']);
}
?>

