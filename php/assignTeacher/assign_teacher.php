<?php
global $pdo;
require '../db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $class_id = $_POST['class_id'];
  $teacher_id = $_POST['teacher_id'];

  $stmt = $pdo->prepare("INSERT INTO class_teachers (class_id, teacher_id) VALUES (?, ?)");
  $stmt->execute([$class_id, $teacher_id]);

  echo json_encode(["status" => "success"]);
}

