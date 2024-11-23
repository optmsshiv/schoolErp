<?php
include '../db_connection.php'; // Include your database connection

if (isset($_GET['user_id'])) {
    $user_id = $_GET['user_id'];

     // Check if the user_id is not empty
     if (empty($user_id)) {
      echo json_encode(["error" => "Invalid user_id"]);
      exit();
  }

    $sql = "SELECT * FROM students WHERE user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $student = $result->fetch_assoc();
        echo json_encode($student);
    } else {
        echo json_encode(["error" => "Student not found"]);
    }
} else {
    echo json_encode(["error" => "No user_id provided"]);
}
?>
