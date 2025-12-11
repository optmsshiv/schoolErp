<?php
session_start();
header('Content-Type: application/json');

// Return the logged-in username
echo json_encode([
  'username' => $_SESSION['username'] ?? 'system'
]);
