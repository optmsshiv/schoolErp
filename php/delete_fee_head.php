<?php
// Include the database connection file
global $pdo;
header('Content-Type: application/json');
include '../php/db_connection.php';

// Check if the fee head name is set in the POST request
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $id = $_POST["fee_head_id"] ?? null;

  if (empty($id)) {
    echo json_encode(["status" => "danger", "message" => "Invalid Fee Head ID"]);
    exit;
  }

  try {
    $stmt = $pdo->prepare("DELETE FROM FeeHeads WHERE fee_head_id = :id");
    $stmt->execute([":id" => $id]);

    echo json_encode(["status" => "success", "message" => "Fee Head deleted successfully"]);
  } catch (PDOException $e) {
    echo json_encode(["status" => "danger", "message" => "Error: " . $e->getMessage()]);
  }
} else {
  echo json_encode(["status" => "danger", "message" => "Invalid request"]);
}
?>
