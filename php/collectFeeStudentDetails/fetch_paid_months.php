<?php
global $pdo;
require '../db_connection.php'; // Your PDO database connection

$user_id = $_GET['user_id'] ?? '';

if (!$user_id) {
    echo json_encode(['error' => 'User ID is required']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT month FROM feeDetails WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $paidMonths = $stmt->fetchAll(PDO::FETCH_COLUMN);

    // Flatten the comma-separated values into a single array
    $allPaidMonths = [];
    foreach ($paidMonths as $monthString) {
        $months = explode(',', $monthString);
        $allPaidMonths = array_merge($allPaidMonths, array_map('trim', $months)); // Trim spaces
    }

  // Fetch previous month's due amount (latest entry)
  $dueStmt = $pdo->prepare("SELECT due_amount FROM feeDetails WHERE user_id = ? ORDER BY id DESC LIMIT 1");
  $dueStmt->execute([$user_id]);
  $previousDue = $dueStmt->fetchColumn();

  //  echo json_encode(array_values(array_unique($allPaidMonths))); // Remove duplicates & re-index

  echo json_encode([
    'paidMonths' => array_values(array_unique($allPaidMonths)), // Remove duplicates & re-index
    'previousDueAmount' => $previousDue ?? 0 // Return 0 if null
  ]);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
