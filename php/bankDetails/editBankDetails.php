<?php
require '../db_connection.php'; // Include the PDO configuration

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = $_POST['id'] ?? 0;
    $bankName = $_POST['bankName'] ?? '';
    $branchName = $_POST['branchName'] ?? '';
    $accountNumber = $_POST['accountNumber'] ?? '';
    $ifscCode = $_POST['ifscCode'] ?? '';
    $accountType = $_POST['accountType'] ?? '';

    try {
        $stmt = $pdo->prepare("
            UPDATE BankDetails
            SET BankName = :bankName, Branch = :branchName, AccountNumber = :accountNumber,
                IFSCCode = :ifscCode, AccountType = :accountType
            WHERE BankID = :id
        ");
        $stmt->execute([
            ':id' => $id,
            ':bankName' => $bankName,
            ':branchName' => $branchName,
            ':accountNumber' => $accountNumber,
            ':ifscCode' => $ifscCode,
            ':accountType' => $accountType,
        ]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'No changes made or record not found.']);
        }
    } catch (PDOException $e) {
        error_log('Update failed: ' . $e->getMessage());
        echo json_encode(['status' => 'error', 'message' => 'Failed to update data.']);
    }
}
?>
