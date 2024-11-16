<?php
// Include the database connection file
include '../php/db_connection.php';

header('Content-Type: application/json');

try {
  $pdo = new PDO($dsn, $user, $pass);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
  echo json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $e->getMessage()]);
  exit;
}

// Check if className is set
if (isset($_POST['className'])) {
    $className = trim($_POST['className']);

    if (empty($className)) {
        echo json_encode(['status' => 'error', 'message' => 'Class name cannot be empty']);
        exit;
    }

    try {
        // Prepare the SQL statement
        $sql = "INSERT INTO Classes (class_name) VALUES (:class_name)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':class_name', $className, PDO::PARAM_STR);

        // Execute the statement
        $stmt->execute();

        echo json_encode(['status' => 'success']);
    } catch (PDOException $e) {
        // Handle duplicate entry error
        if ($e->getCode() == 23000) {
            echo json_encode(['status' => 'error', 'message' => 'Class name already exists']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        }
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Class name is required']);
}
?>
