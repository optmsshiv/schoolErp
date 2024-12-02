<?php
require '../db_connection.php'; // Include the PDO configuration

try {
    $stmt = $pdo->query("SELECT BankID, BankName, Branch, AccountNumber, IFSCCode, AccountType FROM BankDetails");
    $bankDetails = $stmt->fetchAll(); // Fetch all records as an associative array

    echo json_encode(['status' => 'success', 'data' => $bankDetails]);
} catch (PDOException $e) {
    error_log('Fetch failed: ' . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Failed to fetch data.']);
}
?>
