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
    // Check duplicate
    $check = $pdo->prepare("SELECT COUNT(*) FROM Feeheads WHERE fee_head_name = :feeHeadName");
    $check->execute([":feeHeadName" => $feeHeadName]);
    if ($check->fetchColumn() > 0) {
      echo json_encode(["status" => "danger", "message" => "Fee Head already exists"]);
      exit;
    }

    // Insert into Fee heads table
    $stmt = $pdo->prepare("INSERT INTO FeeHeads (fee_head_name) VALUES (:feeHeadName)");
    $stmt->execute([":feeHeadName" => $feeHeadName]);

    echo json_encode(["status" => "success", "message" => "Fee Head added successfully"]);
  } catch (PDOException $e) {
    echo json_encode(["status" => "danger", "message" => "Error: " . $e->getMessage()]);
  }
} else {
  echo json_encode(["status" => "danger", "message" => "Invalid request"]);
}
?>
