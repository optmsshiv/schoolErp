<?php
require '../db_connection.php'; // Include the PDO configuration

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $bankName = $_POST['bankName'] ?? '';
    $branchName = $_POST['branchName'] ?? '';
    $accountNumber = $_POST['accountNumber'] ?? '';
    $ifscCode = $_POST['ifscCode'] ?? '';
    $accountType = $_POST['accountType'] ?? '';

    try {
        $stmt = $pdo->prepare("
            INSERT INTO BankDetails (BankName, Branch, AccountNumber, IFSCCode, AccountType)
            VALUES (:bankName, :branchName, :accountNumber, :ifscCode, :accountType)
        ");
        $stmt->execute([
            ':bankName' => $bankName,
            ':branchName' => $branchName,
            ':accountNumber' => $accountNumber,
            ':ifscCode' => $ifscCode,
            ':accountType' => $accountType,
        ]);

        // Respond with the ID of the newly created record
        echo json_encode(['id' => $pdo->lastInsertId(), 'status' => 'success']);
    } catch (PDOException $e) {
        error_log('Insert failed: ' . $e->getMessage());
        echo json_encode(['status' => 'error', 'message' => 'Failed to save data.']);
    }
}
?>
