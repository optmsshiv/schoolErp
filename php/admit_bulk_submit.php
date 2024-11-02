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
    die("Connection failed: " . $conn->connect_error);
}

if (isset($_FILES['file'])) {
    $file = $_FILES['file']['tmp_name'];

    if (($handle = fopen($file, "r")) !== FALSE) {
        // Skip the first line if it contains headers
        fgetcsv($handle);

        // Prepare the SQL statement
        $stmt = $conn->prepare("INSERT INTO students (serial_number, first_name, last_name, phone, email, date_of_birth, gender, class_name, category, religion, guardian, handicapped, father_name, mother_name, roll_no, sr_no, pen_no, aadhar_no, admission_no, admission_date, day_hosteler) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        // Bind parameters
        $stmt->bind_param("isssssssssssisssssss", $serial_number, $first_name, $last_name, $phone, $email, $date_of_birth, $gender, $class_name, $category, $religion, $guardian, $handicapped, $father_name, $mother_name, $roll_no, $sr_no, $pen_no, $aadhar_no, $admission_no, $admission_date, $day_hosteler);

        // Read each row from the CSV
        while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
            // Map CSV fields to variables
            $serial_number = $data[0];
            $first_name = $data[1];
            $last_name = $data[2];
            $phone = $data[3];
            $email = $data[4];
            $date_of_birth = $data[5];
            $gender = $data[6];
            $class_name = $data[7];
            $category = $data[8];
            $religion = $data[9];
            $guardian = $data[10];
            $handicapped = !empty($data[11]) ? 1 : 0; // Assuming 1 for "Yes", 0 for "No"
            $father_name = $data[12];
            $mother_name = $data[13];
            $roll_no = $data[14];
            $sr_no = $data[15];
            $pen_no = $data[16];
            $aadhar_no = $data[17];
            $admission_no = $data[18];
            $admission_date = $data[19];
            $day_hosteler = $data[20];

            // Execute the prepared statement
            $stmt->execute();
        }

        // Close file and connections
        fclose($handle);
        $stmt->close();
        echo "Records inserted successfully.";
    } else {
        echo "Error opening the file.";
    }
} else {
    echo "No file uploaded.";
}

$conn->close();
?>
