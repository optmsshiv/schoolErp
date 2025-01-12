<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include the database connection
require_once '../../db_connection.php';  // Ensure this path matches your project structure

if (isset($_GET['query'])) {
    // Handle the search query
    $query = trim($_GET['query']);
    try {
        // Fetch matching students with JOINs for additional details
        $studentQuery = $pdo->prepare("
            SELECT
                s.first_name,
                s.last_name,
                s.father_name,
                s.class_name,
                s.roll_no,
                s.mother_name,
                s.phone,
                s.gender,
                s.user_id,
                s.day_hosteler AS type,
                COALESCE(f.amount, 'Not Available') AS monthly_fee,
                COALESCE(h.hostel_fee, 'Not Available') AS hostel_fee,
                COALESCE(t.transport_fee, 'Not Available') AS transport_fee
            FROM students s
            LEFT JOIN FeePlans f ON s.class_name = f.class_name
            LEFT JOIN hostels h ON s.hostel_id = h.hostel_id
            LEFT JOIN transport t ON s.transport_id = t.transport_id
            WHERE s.active = 1 AND (
                s.first_name LIKE :query OR
                s.last_name LIKE :query OR
                s.roll_no LIKE :query OR
                s.father_name LIKE :query
            )
            LIMIT 15
        ");
        $studentQuery->execute(['query' => "%$query%"]);
        $students = $studentQuery->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($students);
    } catch (PDOException $e) {
        // Log and return an error response
        error_log('Error fetching students: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch students.']);
    }
} elseif (isset($_GET['user_id'])) {
    // Handle the request for fee details
    $userId = intval($_GET['user_id']);
    try {
        // Fetch fee details for the specific user
        $feeQuery = $pdo->prepare("
            SELECT
                receipt_no AS receiptId,
                month,
                due_amount AS dueAmount,
                pending_amount AS pendingAmount,
                received_amount AS receivedAmount,
                total_amount AS totalAmount,
                CASE
                    WHEN pending_amount = 0 THEN 'Paid'
                    ELSE 'Pending'
                END AS status
            FROM fees
            WHERE user_id = :user_id AND active = 1
        ");
        $feeQuery->execute(['user_id' => $userId]);
        $fees = $feeQuery->fetchAll(PDO::FETCH_ASSOC);

        // Calculate totals for fees
        $totalPaid = 0;
        $pendingAmount = 0;
        foreach ($fees as $fee) {
            $totalPaid += $fee['receivedAmount'];
            $pendingAmount += $fee['pendingAmount'];
        }

        // Return fee details and totals
        echo json_encode([
            'fees' => $fees,
            'totals' => [
                'totalPaid' => $totalPaid,
                'pendingAmount' => $pendingAmount
            ]
        ]);
    } catch (PDOException $e) {
        // Log and return an error response
        error_log('Error fetching fee details: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch fee details.']);
    }
} else {
    // Handle invalid requests
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request.']);
}
?>
