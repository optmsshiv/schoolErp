<?php
global $pdo;
require '../db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $class_id = $_POST['class_id'];
  $teacher_id = $_POST['teacher_id'];

  // ✅ Check if assignment already exists
  $check = $pdo->prepare("SELECT COUNT(*) FROM class_teachers WHERE class_id = ? AND teacher_id = ?");
  $check->execute([$class_id, $teacher_id]);
  $exists = $check->fetchColumn();

  if ($exists > 0) {
    echo json_encode(["status" => "error", "message" => "This teacher is already assigned to this class."]);
    exit;
  }

  // ✅ Insert new assignment
  $stmt = $pdo->prepare("INSERT INTO class_teachers (class_id, teacher_id) VALUES (?, ?)");
  $stmt->execute([$class_id, $teacher_id]);

  echo json_encode(["status" => "success", "message" => "Teacher assigned successfully."]);
}

