<?php
global $pdo;
include "../db_connection.php";

header("Content-Type: application/json");

try {
  $stmt = $pdo->prepare("SELECT BankName FROM BankDetails ORDER BY BankName ASC");
  $stmt->execute();

  $banks = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode(["success" => true, "banks" => $banks]);
} catch (Exception $e) {
  echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
