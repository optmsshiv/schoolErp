<?php
global $pdo;
require '../db_connection.php';


$sql = "SELECT ct.id, c.class_name, u.fullname AS teacher_name,
               ct.assigned_date, ct.updated_at
        FROM class_teachers ct
        JOIN Classes c ON ct.class_id = c.class_id
        JOIN userRole u ON ct.teacher_id = u.id";
$result = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($result);
