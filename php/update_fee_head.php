<?php
// update_fee_head.php

global $pdo;
header('Content-Type: application/json');
include '../php/db_connection.php'; // Make sure db_connection.php sets up a PDO connection as $pdo

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $id = $_POST["fee_head_id"] ?? null;
  $feeHeadName = trim($_POST["feeHeadName"]);

  if (empty($id) || empty($feeHeadName)) {
    echo json_encode(["status" => "danger", "message" => "Invalid input"]);
    exit;
  }

  try {
    // Check duplicate (excluding current record)
    $check = $pdo->prepare("SELECT COUNT(*) FROM Feeheads WHERE fee_head_name = :name AND fee_head_id != :id");
    $check->execute([":name" => $feeHeadName, ":id" => $id]);
    if ($check->fetchColumn() > 0) {
      echo json_encode(["status" => "danger", "message" => "Fee Head already exists"]);
      exit;
    }

    // Update
    $stmt = $pdo->prepare("UPDATE Feeheads SET fee_head_name = :name WHERE fee_head_id = :id");
    $stmt->execute([":name" => $feeHeadName, ":id" => $id]);

    echo json_encode(["status" => "success", "message" => "Fee Head updated successfully"]);
  } catch (PDOException $e) {
    echo json_encode(["status" => "danger", "message" => "Error: " . $e->getMessage()]);
  }
} else {
  echo json_encode(["status" => "danger", "message" => "Invalid request"]);
}
