<?php
// Database connection configuration
$host = 'localhost';
$port = '3306'; // Specify port separately for better clarity
$db = 'edrppymy_rrgis';
$user = 'edrppymy_admin';
$pass = '13579@demo';

try {
    // Create a PDO instance with the DSN
    $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $pass);

    // Set PDO attributes
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC); // Fetch as associative arrays by default

    // Optionally, you can check the connection is working
    $pdo->query("SELECT 1");  // A simple test query

} catch (PDOException $e) {
    // Log error to a file instead of exposing it publicly
    error_log('Database connection failed: ' . $e->getMessage(), 0);

    // Respond with a generic message
    echo json_encode([
        'status' => 'error',
        'message' => 'Unable to connect to the database. Please try again later.'
    ]);
    exit; // Stop further script execution in case of failure
}
?>
