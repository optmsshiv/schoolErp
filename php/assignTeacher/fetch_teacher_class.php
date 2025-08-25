<?php
global $pdo;
require '../db_connection.php'; // your PDO connection

// Fetch classes
$classes = $pdo->query("SELECT class_id, class_name FROM classes")->fetchAll(PDO::FETCH_ASSOC);

// Fetch teachers
$teachers = $pdo->query("SELECT id, fullname FROM userrole WHERE role = 'teacher'")->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
  "classes" => $classes,
  "teachers" => $teachers
]);

