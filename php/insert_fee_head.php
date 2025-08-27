<?php
global $pdo;
include '../db_connection.php'; // your DB connection file

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $feeHeadName = trim($_POST['fee_head_name']);

  if (!empty($feeHeadName)) {
    $stmt = $pdo->prepare("INSERT INTO FeeHeads (fee_head_name) VALUES (?)");
    $stmt->execute([$feeHeadName]);

    echo json_encode(["success" => true, "message" => "Fee Head added successfully"]);
  } else {
    echo json_encode(["success" => false, "message" => "Fee head name is required"]);
  }
}
