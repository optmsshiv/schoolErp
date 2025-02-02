<?php
// Include database connection
include '../db_connection.php';

// delete_user.php
if (isset($_POST['user_id'])) {
  $userId = $_POST['user_id'];

  // Assuming you have already set up a PDO connection as $pdo
  try {
    $stmt = $pdo->prepare("DELETE FROM users WHERE user_id = :user_id");
    $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
    $stmt->execute();

    // Check if the deletion was successful
    if ($stmt->rowCount() > 0) {
      echo json_encode(['success' => true]);
    } else {
      echo json_encode(['success' => false, 'message' => 'User not found or already deleted']);
    }
  } catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
  }
}
?>
