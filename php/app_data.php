<?php
// Include the database connection
require_once '/php/db_connection.php'; // Path to your db_connection.php file

// Get POST data
$username = $_POST['username'] ?? null;
$password = $_POST['password'] ?? null;

// Validate input
if (empty($username) || empty($password)) {
    echo json_encode([
        'success' => false,
        'message' => 'Username or password cannot be empty'
    ]);
    exit;
}

try {
    // Prepare a statement to query the database for the user
    $stmt = $pdo->prepare("SELECT id, password FROM users WHERE username = :username");
    $stmt->execute(['username' => $username]);

    // Fetch the user record
    $user = $stmt->fetch();

    if ($user) {
        // Assuming the password in the database is hashed, use password_verify()
        if (password_verify($password, $user['password'])) {
            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'user_id' => $user['id']
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Invalid password'
            ]);
        }
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'User not found'
        ]);
    }
} catch (PDOException $e) {
    // Log error and return a generic error message
    error_log('Database query error: ' . $e->getMessage(), 0);

    echo json_encode([
        'success' => false,
        'message' => 'An error occurred. Please try again later.'
    ]);
}
?>
