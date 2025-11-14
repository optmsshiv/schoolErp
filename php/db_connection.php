<?php
// Set PHP timezone (affects PHP functions)
date_default_timezone_set('Asia/Kolkata');

$host = 'localhost';
$port = '3306';
$db   = 'edrppymy_rrgis';
$user = 'edrppymy_admin';
$pass = '13579@demo';

// Local testing
// $db   = 'rrgis';
// $user = 'root';
// $pass = '';

try {
  // Create PDO connection
  $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";
  $pdo = new PDO($dsn, $user, $pass);

  // PDO attributes
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

  // FIX: Set MySQL timezone AFTER PDO is created
  $pdo->exec("SET time_zone = '+05:30'");

  // Simple test
  $pdo->query("SELECT 1");

} catch (PDOException $e) {
  error_log('Database connection failed: ' . $e->getMessage(), 0);

  echo json_encode([
    'status' => 'error',
    'message' => 'Unable to connect to the database. Please try again later.'
  ]);
  exit;
}
?>
