<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$servername = "localhost:3306";  // Replace with your database server name or IP address
$username = "edrppymy_admin";  // Replace with your MySQL username
$password = "13579@demo";  // Replace with your MySQL password
$dbname = "edrppymy_rrgis";    // Replace with your database name
/*
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
    echo "Connected successfully to the database";
}*/


// Create a connection to the database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Function to generate a random password
function generatePassword($length = 8) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomPassword = '';
    for ($i = 0; $i < $length; $i++) {
        $randomPassword .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomPassword;
}

// Function to generate a unique user ID based on the user's name
function generateUserId($fullname) {
    // Generate a 4-digit unique part
    $uniquePart = sprintf('%04d', rand(0, 9999));  // Generates a 4-digit number with leading zeros if needed
    $namePart = strtoupper(substr($fullname, 0, 3));  // Example: John -> JOH
   // $uniquePart = uniqid();
    return $namePart . '-' . $uniquePart;  // Example: JOH-1234
}

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Capture form data
    $fullname = $_POST['basicFullname'];
    $role = $_POST['basicPost'];
    $email = $_POST['basicEmail'];
    $phoneNumber = $_POST['phoneNumber'];
    $joiningDate = $_POST['basicDate'];
    $status = $_POST['basicStatus'];
    $salary = $_POST['basicSalary'];

    // Generate user ID and password
    $userId = generateUserId($fullname);
    $password = generatePassword(6);  // You can increase the length by passing a number to the function (e.g., generatePassword(10))
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Prepare the SQL query to insert data
    $sql = "INSERT INTO userRole (user_id, fullname, role, email, phone, joining_date, status, salary, password) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    // Prepare the statement
    if ($stmt = $conn->prepare($sql)) {
        // Bind the form data and generated values
        $stmt->bind_param("sssssssss", $userId, $fullname, $role, $email, $phoneNumber, $joiningDate, $status, $salary, $hashedPassword);

        // Execute the query and check for errors
        if ($stmt->execute()) {
         //   header('Content-Type: application/json');
        //    echo "New record created successfully with User ID: $userId and Password: $password";
         echo json_encode(['success' => true, 'userId' => $userId, 'password' => $password]);
        } else {
        //    echo "Error executing query: " . $stmt->error;
        echo json_encode(['success' => false, 'message' => 'Error executing query: ' . $stmt->error]);
        }

        // Close the statement
        $stmt->close();
    } else {
      //  echo "Error preparing the statement: " . $conn->error;
       echo json_encode(['success' => false, 'message' => 'Error preparing the statement: ' . $conn->error]);
    }

    // Close the connection
    $conn->close();
}

?>
