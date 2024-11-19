<?php
include '../db_connection.php'; // Include PDO database connection script

header('Content-Type: application/json');

// Get POST data
$feeHead = trim($_POST['fee_head_name']) ?? null;
$className = trim($_POST['class_name']) ?? null;
$month = trim($_POST['month']) ?? null; // Expecting an array
$amount = trim($_POST['amount']) ?? null;

// Validate input
if (!$feeHead || !$className || !$month || !$amount) {
  echo json_encode([
      'status' => 'error',
      'message' => 'Please fill all fields.',
      'debug' => [
          'fee_head_name' => $feeHead,
          'class_name' => $className,
          'month' => $month,
          'amount' => $amount
      ]
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
  $monthArray = explode(',', $month); // If months are sent as a comma-separated string
  foreach ($monthArray as $month_name) {
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
    'message' => 'Please fill all fields.',
    'debug' => [
        'fee_head_name' => isset($_POST['fee_head_name']) ? $_POST['fee_head_name'] : 'Not set',
        'class_name' => isset($_POST['class_name']) ? $_POST['class_name'] : 'Not set',
        'month' => isset($_POST['month']) ? $_POST['month'] : 'Not set',
        'amount' => isset($_POST['amount']) ? $_POST['amount'] : 'Not set'
    ]
]);
}

// Close the connection
$conn = null;
?>
