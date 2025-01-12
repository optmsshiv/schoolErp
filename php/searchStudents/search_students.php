<?php
require_once '../db_connection.php';

if (isset($_GET['query'])) {
    $query = trim($_GET['query']);
    try {
        // Fetch matching students
        $studentQuery = $pdo->prepare("
            SELECT
                user_id, first_name, last_name, father_name, class_name,
                roll_no, phone, gender, monthly_fee, hostel_fee, transport_fee
            FROM students
            WHERE active = 1 AND
                  (first_name LIKE :query OR last_name LIKE :query OR roll_no LIKE :query)
        ");
        $studentQuery->execute(['query' => "%$query%"]);
        $students = $studentQuery->fetchAll();

        echo json_encode($students);
    } catch (PDOException $e) {
        error_log('Error fetching students: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch students.']);
    }
} elseif (isset($_GET['user_id'])) {
    $userId = intval($_GET['user_id']);
    try {
        // Fetch fee details for the student
        $feeQuery = $pdo->prepare("
            SELECT
                receipt_no AS receiptId, month, due_amount AS dueAmount,
                pending_amount AS pendingAmount, received_amount AS receivedAmount,
                total_amount AS totalAmount,
                CASE WHEN pending_amount = 0 THEN 'Paid' ELSE 'Pending' END AS status
            FROM feeDetails
            WHERE user_id = :user_id AND active = 1
        ");
        $feeQuery->execute(['user_id' => $userId]);
        $fees = $feeQuery->fetchAll();

        // Calculate totals
        $totalPaid = 0;
        $pendingAmount = 0;
        foreach ($fees as $fee) {
            $totalPaid += $fee['receivedAmount'];
            $pendingAmount += $fee['pendingAmount'];
        }

        echo json_encode([
            'fees' => $fees,
            'totals' => [
                'totalPaid' => $totalPaid,
                'pendingAmount' => $pendingAmount
            ]
        ]);
    } catch (PDOException $e) {
        error_log('Error fetching fee details: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch fee details.']);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request.']);
}
?>
