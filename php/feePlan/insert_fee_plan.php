<?php
include '../db_connection.php'; // Include PDO database connection script

header('Content-Type: application/json');

// Get POST data
$feeHead = $_POST['feeHead'] ?? null;
$className = $_POST['className'] ?? null;
$month = $_POST['month'] ?? null; // Expecting an array
$amount = $_POST['feeAmount'] ?? null;

// Validate input
if (!$feeHead || !$className || !$month || !$amount) {
    echo json_encode([
        'status' => 'error',
        'message' => 'All fields are required.'
    ]);
    exit;
}

try {
  // Start the transaction
  $conn->beginTransaction();

  // Prepare the SQL query
  $sql = "INSERT INTO FeePlans (fee_head_name, class_name, month_name, amount)
          VALUES (:fee_head_name, :class_name, :month_name, :amount)";
  $stmt = $conn->prepare($sql);

  // Loop through months and insert data
  $monthsArray = explode(',', $months); // If months are sent as a comma-separated string
  foreach ($monthsArray as $month_name) {
      $stmt->execute([
          ':fee_head_name' => $feeHead,
          ':class_name' => $className,
          ':month_name' => $month_name,
          ':amount' => $amount
      ]);
  }

  // Commit the transaction
  $conn->commit();

  echo json_encode([
      'status' => 'success',
      'message' => 'Fee plan added successfully.'
  ]);
} catch (PDOException $e) {
  // Rollback if there's an error
  $conn->rollBack();

  // Log detailed error to PHP error log
  error_log('Error: ' . $e->getMessage());

  // Send error message with details
  echo json_encode([
      'status' => 'error',
      'message' => 'Database error: ' . $e->getMessage()
  ]);
}

// Close the connection
$conn = null;
?>
