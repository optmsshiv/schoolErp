<?php
// Database configuration
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

// Query to fetch student data
$sql = "SELECT first_name, father_name, class_name, roll_no, phone, user_id FROM students";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Output data of each row
    while ($row = $result->fetch_assoc()) {
        echo "<tr>
                <td><input type='checkbox'></td>

                <td>" . $row["first_name"] . "</td>
                <td>" . $row["father_name"] . "</td>
                <td>" . $row["class_name"] . "</td>
                <td>" . $row["roll_no"] . "</td>
                <td>" . $row["phone"] . "</td>
                <td>" . $row["user_id"] . "</td>
                <td>
                    <button class='btn btn-primary btn-sm'>Edit</button>
                    <button class='btn btn-danger btn-sm'>Delete</button>
                </td>
            </tr>";
    }
} else {
    echo "<tr><td colspan='9'>No records found</td></tr>";
}

// Close connection
$conn->close();
?>
