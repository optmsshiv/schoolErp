<?php
header('Content-Type: application/json');

// Database connection parameters
$servername = "localhost:3306";
$username = "edrppymy_admin";
$password = "13579@demo";
$dbname = "edrppymy_rrgis";

// Connect to the database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]));
}

// Decode the table data sent from the client
$tableData = json_decode($_POST['tableData'], true);

// Validate table data
if (!$tableData || !is_array($tableData)) {
    echo json_encode(["success" => false, "message" => "No valid table data received"]);
    exit;
}

// Prepare the SQL insert statement
$sql = "INSERT INTO students (
    s_no, first_name, last_name, phone, email, dob, gender, class_name, category,
    religion, guardian, handicapped, father_name, mother_name, roll_no, sr_no,
    pen_no, aadhar_no, admission_no, admission_date, day_hosteler
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

// Prepare statement
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Failed to prepare SQL statement"]);
    exit;
}

// Bind parameters and execute the statement for each row
foreach ($tableData as $row) {
    $stmt->bind_param(
        "issssssssssssssssssss",
        $row['sNo'], $row['firstName'], $row['lastName'], $row['phone'], $row['email'],
        $row['dob'], $row['gender'], $row['className'], $row['category'], $row['religion'],
        $row['guardian'], $row['handicapped'], $row['fatherName'], $row['motherName'],
        $row['rollNo'], $row['srNo'], $row['penNo'], $row['aadharNo'], $row['admissionNo'],
        $row['admissionDate'], $row['dayHosteler']
    );

    // Execute statement
    if (!$stmt->execute()) {
        echo json_encode(["success" => false, "message" => "Error inserting data for student: " . $row['firstName']]);
        exit;
    }
}

// Close statement and connection
$stmt->close();
$conn->close();

// Send success response
echo json_encode(["success" => true, "message" => "All data uploaded successfully"]);

?>
