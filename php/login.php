<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$servername = "localhost:3306";
$username = "edrppymy_admin"; // Replace with your username
$password = "13579@demo"; // Replace with your password
$dbname = "edrppymy_rrgis"; // Replace with your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$message = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user = $_POST['username'] ?? '';
    $pass = $_POST['password'] ?? '';

    // Validate user inputs
    if (empty($user) || empty($pass)) {
        $message = "Please enter both username and password.";
    } else {
        // Prepare and execute query
        $stmt = $conn->prepare("SELECT * FROM users WHERE username = ? AND password = ?");
        $stmt->bind_param("ss", $user, $pass);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            // Successful login
            header("Location: ../html/index.html"); // Redirect to dashboard
            exit();
        } else {
            // Invalid credentials
        //  echo  $message = "Invalid username or password.";
         // Invalid password
         //   echo "<script>alert('Invalid user name or password. Please try again.'); window.history.back();</script>";
         
         echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
    echo "<script>
    document.addEventListener('DOMContentLoaded', function() {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Invalid username or password. Please try again.',
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                window.history.back(); // Go back to the login page after user confirmation
            }
        });
    });
</script>";
            
        }

        $stmt->close();
    }
}

$conn->close();
?>