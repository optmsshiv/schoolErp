<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include database connection
require_once '../../db_connection.php'; // Ensure $pdo is properly configured

header('Content-Type: application/json');

try {
    // Check if the 'query' parameter is provided (searching for students)
    if (isset($_GET['query'])) {
        $query = trim($_GET['query']);
        if (empty($query)) {
            http_response_code(400);
            echo json_encode(['error' => 'Search query is required.']);
            exit;
        }

        // Fetch matching students
        $studentQuery = $pdo->prepare("
            SELECT
                user_id, first_name, last_name, father_name, class_name,
                roll_no, phone, gender, monthly_fee, hostel_fee, transport_fee
            FROM students
            WHERE active = 1 AND
                  (first_name LIKE :query OR last_name LIKE :query OR roll_no LIKE :query)
            LIMIT 15
        ");
        $studentQuery->execute(['query' => "%$query%"]);
        $students = $studentQuery->fetchAll(PDO::FETCH_ASSOC);

        // Handle no results found
        if (empty($students)) {
            echo json_encode(['message' => 'No students found matching the query.']);
            exit;
        }

        // Return the student data
        echo json_encode($students);

    // Check if the 'user_id' parameter is provided (fetching fee details)
    } elseif (isset($_GET['user_id'])) {
        $userId = intval($_GET['user_id']);
        if ($userId <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Valid user ID is required.']);
            exit;
        }

        // Fetch fee details for the student
        $feeQuery = $pdo->prepare("
            SELECT
                receipt_no AS receiptId, month, due_amount AS dueAmount,
                pending_amount AS pendingAmount, received_amount AS receivedAmount,
                total_amount AS totalAmount,
                CASE WHEN pending_amount = 0 THEN 'Paid' ELSE 'Pending' END AS status
            FROM fees
            WHERE user_id = :user_id AND active = 1
        ");
        $feeQuery->execute(['user_id' => $userId]);
        $fees = $feeQuery->fetchAll(PDO::FETCH_ASSOC);

        // Calculate totals
        $totalPaid = 0;
        $pendingAmount = 0;
        foreach ($fees as $fee) {
            $totalPaid += $fee['receivedAmount'];
            $pendingAmount += $fee['pendingAmount'];
        }

        // Return fee details along with totals
        echo json_encode([
            'fees' => $fees,
            'totals' => [
                'totalPaid' => $totalPaid,
                'pendingAmount' => $pendingAmount
            ]
        ]);
    } else {
        // Invalid request if neither 'query' nor 'user_id' is provided
        http_response_code(400);
        echo json_encode(['error' => 'Invalid request. Either "query" or "user_id" parameter is required.']);
    }

} catch (PDOException $e) {
    // Handle database errors
    error_log('Database error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'An internal server error occurred.']);
}
?>
