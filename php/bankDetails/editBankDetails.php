<?php
require '../db_connection.php'; // Include the PDO configuration

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = $_POST['id'] ?? ''; // Ensure BankID is retrieved from the POST request
    $bankName = $_POST['bankName'] ?? '';
    $branchName = $_POST['branchName'] ?? '';
    $accountNumber = $_POST['accountNumber'] ?? '';
    $ifscCode = $_POST['ifscCode'] ?? '';
    $accountType = $_POST['accountType'] ?? '';

    // Validate required fields
    if (empty($id)) {
        echo json_encode(['status' => 'error', 'message' => 'Bank ID is required']);
        exit;
    }

    if (empty($bankName)) {
        echo json_encode(['status' => 'error', 'message' => 'Bank Name is required']);
        exit;
    }

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

        // Check how many rows were affected
        if ($stmt->rowCount() > 0) {
            echo json_encode(['status' => 'success', 'message' => 'Bank details updated successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'No changes made or record not found']);
        }
    } catch (PDOException $e) {
        error_log('Update failed: ' . $e->getMessage());
        echo json_encode(['status' => 'error', 'message' => 'Failed to update data']);
    }
}
?>
