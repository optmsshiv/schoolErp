<?php
require '../db_connection.php'; // Include your PDO connection setup

try {
    $stmt = $pdo->query("SELECT BankID, BankName, Branch, AccountNumber, IFSCCode, AccountType FROM BankDetails");
    $bankDetails = $stmt->fetchAll(PDO::FETCH_ASSOC); // Fetch data as an associative array

    echo json_encode(['status' => 'success', 'data' => $bankDetails]);
} catch (PDOException $e) {
    error_log('Fetch failed: ' . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Failed to fetch data.']);
}
?>
