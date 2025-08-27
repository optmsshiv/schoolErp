<?php
global $pdo;
header("Content-Type: application/json");
include '../php/db_connection.php'; // your DB connection file (PDO)

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $feeHeadName = trim($_POST["feeHeadName"]);

  if (empty($feeHeadName)) {
    echo json_encode(["status" => "danger", "message" => "Fee Head Name is required"]);
    exit;
  }

  try {
    // Insert into Feeheads table
    $stmt = $pdo->prepare("INSERT INTO Feeheads (fee_head_name) VALUES (:feeHeadName)");
    $stmt->execute([":feeHeadName" => $feeHeadName]);

    echo json_encode(["status" => "success", "message" => "Fee Head added successfully"]);
  } catch (PDOException $e) {
    echo json_encode(["status" => "danger", "message" => "Error: " . $e->getMessage()]);
  }
} else {
  echo json_encode(["status" => "danger", "message" => "Invalid request"]);
}
?>
