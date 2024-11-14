<?php
// Insert Fee Head into the database

// Database connection
$host = 'localhost:3306';
$db = 'edrppymy_rrgis';
$user = 'edrppymy_admin';
$pass = '13579@demo';

$dsn = "mysql:host=$host;dbname=$db";

try {
    $pdo = new PDO($dsn, $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the fee head name from the request
    $feeHeadName = trim($_POST['feeHeadName']);

    if (empty($feeHeadName)) {
        echo json_encode(['status' => 'error', 'message' => 'Fee head name is required']);
        exit;
    }

    // Insert fee head into the database
    $sql = "INSERT INTO FeeHeads (name) VALUES (:name)";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':name', $feeHeadName);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to insert fee head']);
    }
}
?>
