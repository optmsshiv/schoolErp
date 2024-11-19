<?php
// Include the database connection file
include '../db_connection.php';

header('Content-Type: application/json');

try {
    // Ensure $pdo is defined for PDO use
    if (!isset($pdo)) {
        throw new Exception("Database connection not established");
    }

    // Check if the request method is POST
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Decode the incoming JSON data
        $data = json_decode(file_get_contents('php://input'), true);

        // Ensure all required fields are present and not empty
        if (!empty($data['feeHead']) && !empty($data['className']) && !empty($data['month']) && !empty($data['amount'])) {
            // Sanitize and trim the input data
            $feeHeadName = trim($data['feeHead']);
            $className = trim($data['className']);
            $month = trim($data['month']); // Expecting a comma-separated string
            $amount = (int) $data['amount']; // Ensure it's an integer

            // Prepare the SQL statement to insert the fee plan
            try {
                $sql = "INSERT INTO FeePlans (fee_head_name, class_name, month_name, amount)
                        VALUES (:fee_head_name, :class_name, :month_name, :amount)";
                $stmt = $pdo->prepare($sql);

                // Bind parameters to the query
                $stmt->bindParam(':fee_head_name', $feeHeadName, PDO::PARAM_STR);
                $stmt->bindParam(':class_name', $className, PDO::PARAM_STR);
                $stmt->bindParam(':month_name', $month, PDO::PARAM_STR); // Month is a comma-separated string
                $stmt->bindParam(':amount', $amount, PDO::PARAM_INT);

                // Execute the statement
                $stmt->execute();

                // Respond with success
                http_response_code(201); // 201 Created
                echo json_encode(['status' => 'success', 'message' => 'Fee plan added successfully']);
            } catch (PDOException $e) {
                // Handle duplicate entry error
                if ($e->getCode() == 23000) { // Integrity constraint violation (e.g., unique constraint)
                    http_response_code(409); // 409 Conflict
                    echo json_encode(['status' => 'error', 'message' => 'Fee plan for this class and month already exists']);
                } else {
                    http_response_code(500); // 500 Internal Server Error
                    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
                }
            }
        } else {
            // Respond with validation error for missing fields
            http_response_code(400); // 400 Bad Request
            echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
        }
    } else {
        // Respond with method not allowed
        http_response_code(405); // 405 Method Not Allowed
        echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    }
} catch (Exception $e) {
    // Handle general exceptions
    http_response_code(500); // 500 Internal Server Error
    echo json_encode(['status' => 'error', 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
