<?php
require 'db.php'; // Include your PDO database connection

if (!isset($_GET['user_id'])) {
    echo json_encode(["error" => "User ID is required"]);
    exit;
}

$user_id = $_GET['user_id'];

try {
    // Step 1: Get class_name from feeDetails
    $stmt = $pdo->prepare("SELECT class_name FROM feeDetails WHERE user_id = ? LIMIT 1");
    $stmt->execute([$user_id]);
    $classResult = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$classResult) {
        echo json_encode(["error" => "User class not found"]);
        exit;
    }

    $class_name = $classResult['class_name'];

    // Step 2: Get monthly_fee from FeePlans using class_name
    $stmt = $pdo->prepare("SELECT monthly_fee FROM FeePlans WHERE class_name = ?");
    $stmt->execute([$class_name]);
    $feePlan = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$feePlan) {
        echo json_encode(["error" => "Fee plan not found"]);
        exit;
    }

    $monthly_fee = $feePlan['monthly_fee'];

    // Step 3: Get paid months from feeDetails
    $stmt = $pdo->prepare("SELECT month FROM feeDetails WHERE user_id = ? AND status = 'paid'");
    $stmt->execute([$user_id]);
    $paidMonths = $stmt->fetchAll(PDO::FETCH_COLUMN); // Fetch only month values

    // Step 4: Return data
    echo json_encode([
        "class_name"   => $class_name,
        "monthly_fee"  => $monthly_fee,
        "paid_months"  => $paidMonths
    ]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
