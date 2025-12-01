<?php
global $pdo;
header("Content-Type: application/json");
include '../php/db_connection.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $feeHeadName = trim($_POST["feeHeadName"] ?? '');
  $feeType = trim($_POST["feeType"] ?? '');

  if ($feeHeadName === '' || $feeType === '') {
    echo json_encode(["status" => "danger", "message" => "Fee Head Name and Fee Type are required"]);
    exit;
  }

  try {
    // Check duplicate (name + type)
    $check = $pdo->prepare("
            SELECT COUNT(*) FROM FeeHeads
            WHERE fee_head_name = :name AND fee_type = :type
        ");
    $check->execute([
      ":name" => $feeHeadName,
      ":type" => $feeType
    ]);

    if ($check->fetchColumn() > 0) {
      echo json_encode(["status" => "danger", "message" => "This fee head and type already exist"]);
      exit;
    }

    // Insert new fee head
    $stmt = $pdo->prepare("
            INSERT INTO FeeHeads (fee_head_name, fee_type)
            VALUES (:name, :type)
        ");
    $stmt->execute([
      ":name" => $feeHeadName,
      ":type" => $feeType
    ]);

    echo json_encode(["status" => "success", "message" => "Fee Head added successfully"]);
  }
  catch (PDOException $e) {
    echo json_encode(["status" => "danger", "message" => "Error: " . $e->getMessage()]);
  }
}
else {
  echo json_encode(["status" => "danger", "message" => "Invalid request"]);
}
?>
