<?php
// update_class.php
include 'db.php'; // Include your database connection

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $className = $_POST['className']; // Get the class ID
    $newName = $_POST['newName']; // Get the new class name

    // Validate inputs
    if (empty($newName)) {
        echo json_encode(['status' => 'error', 'message' => 'Class name cannot be empty.']);
        exit;
    }

    // Update query
    $stmt = $pdo->prepare("UPDATE Classes SET class_name = ? WHERE class_name = ?");
    $stmt->execute([$newName, $className]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update class name.']);
    }
}
?>
