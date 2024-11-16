<?php
// update_class.php
include '../db_connection.php'; // Include your database connection

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Get the classId and new class name from the POST request
  $classId = $_POST['classId'];
  $newName = $_POST['newName'];

  // Validate inputs
  if (empty($newName)) {
      echo json_encode(['status' => 'error', 'message' => 'Class name cannot be empty.']);
      exit;
  }

  // Update query to change the class_name where the class_id matches
  $stmt = $pdo->prepare("UPDATE Classes SET class_name = ? WHERE class_id = ?");
  $stmt->execute([$newName, $classId]);

  // Check if the update was successful
  if ($stmt->rowCount() > 0) {
      echo json_encode(['status' => 'success', 'message' => 'Class name updated successfully.']);
  } else {
      echo json_encode(['status' => 'error', 'message' => 'Failed to update class name.']);
  }
}
?>
