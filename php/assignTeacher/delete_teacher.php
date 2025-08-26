<?php
global $pdo;
require '../db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $id = $_POST['id']; // class_teachers.id

  $stmt = $pdo->prepare("DELETE FROM class_teachers WHERE id = ?");
  $stmt->execute([$id]);

  echo json_encode(["status" => "success", "message" => "Assignment deleted successfully."]);
}
