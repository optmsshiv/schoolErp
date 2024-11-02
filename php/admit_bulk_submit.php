<?php

header('Content-Type: application/json');

// Database connection parameters
$servername = "localhost:3306";
$username = "edrppymy_admin";
$password = "13579@demo";
$dbname = "edrppymy_rrgis";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

// Get the raw POST data
$data = json_decode(file_get_contents("php://input"), true);

// Initialize an array to hold any failed insertions
$failed_inserts = [];

// Prepare the SQL statement
$stmt = $conn->prepare("INSERT INTO your_table_name (serial_number, first_name, last_name, phone, email, date_of_birth, gender, class_name, category, religion, guardian, handicapped, father_name, mother_name, roll_no, sr_no, pen_no, aadhar_no, admission_no, admission_date, day_hosteler) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

if (!$stmt) {
    die(json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]));
}

// Bind parameters
$stmt->bind_param("issssssssssssssssssss", $serial_number, $first_name, $last_name, $phone, $email, $date_of_birth, $gender, $class_name, $category, $religion, $guardian, $handicapped, $father_name, $mother_name, $roll_no, $sr_no, $pen_no, $aadhar_no, $admission_no, $admission_date, $day_hosteler);

// Loop through the incoming data
foreach ($data as $row) {
    $serial_number = $row['serial_number'];
    $first_name = $row['first_name'];
    $last_name = $row['last_name'];
    $phone = $row['phone'];
    $email = $row['email'];
    $date_of_birth = $row['date_of_birth'];
    $gender = $row['gender'];
    $class_name = $row['class_name'];
    $category = $row['category'];
    $religion = $row['religion'];
    $guardian = $row['guardian'];
    $handicapped = $row['handicapped'];
    $father_name = $row['father_name'];
    $mother_name = $row['mother_name'];
    $roll_no = $row['roll_no'];
    $sr_no = $row['sr_no'];
    $pen_no = $row['pen_no'];
    $aadhar_no = $row['aadhar_no'];
    $admission_no = $row['admission_no'];
    $admission_date = $row['admission_date'];
    $day_hosteler = $row['day_hosteler'];

    // Execute the statement
    if (!$stmt->execute()) {
        $failed_inserts[] = $row; // Keep track of failed inserts
    }
}

// Close the prepared statement and connection
$stmt->close();
$conn->close();

// Respond with success or failure
if (empty($failed_inserts)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Some rows failed to insert.', 'failed_rows' => $failed_inserts]);
}
?>

