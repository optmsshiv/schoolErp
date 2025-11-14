<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

$servername = "localhost:3306";
$username = "edrppymy_admin";
$password = "13579@demo";
$dbname = "edrppymy_rrgis";


// --- database for local testing
// $servername = 'localhost:3306';
//$port = '3306';
// $dbname = 'rrgis';
// $username = 'root';
// $password = '';

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $user = $_POST['username'] ?? '';
  $pass = $_POST['password'] ?? '';

  if (empty($user) || empty($pass)) {
    echo "<script>alert('Please enter both username and password.'); window.history.back();</script>";
    exit();
  }

  // Use prepared statements to prevent SQL injection
  $stmt = $conn->prepare("SELECT id, username, password, role FROM users WHERE username = ?");
  $stmt->bind_param("s", $user);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($row = $result->fetch_assoc()) {
    // Verify password (you can later switch to password_hash)
    if ($pass === $row['password']) {

      // Store session variables
      $_SESSION['user_id'] = $row['id'];
      $_SESSION['username'] = $row['username'];
      $_SESSION['role'] = $row['role'];

      // Redirect based on role
      echo "<script>
    sessionStorage.setItem('username', '" . $row['username'] . "');
    sessionStorage.setItem('role', '" . $row['role'] . "');
         </script>";

      echo match ($row['role']) {
        'admin' => "<script>window.location.href = '../html/index.html';</script>",
        'teacher' => "<script>window.location.href = '../html/teacher-dashboard.html';</script>",
        'accountant' => "<script>window.location.href = '../html/accountant-dashboard.html';</script>",
        default => "<script>window.location.href = '../html/user-dashboard.html';</script>",
      };
      exit();


    } else {
      showError("Invalid password.");
    }
  } else {
    showError("User not found.");
  }

  $stmt->close();
}

$conn->close();

// Function to show error with SweetAlert2
function showError($message)
{
  echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
  echo "<script>
        document.addEventListener('DOMContentLoaded', function() {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: '$message',
                confirmButtonText: 'OK'
            }).then(() => {
                window.history.back();
            });
        });
    </script>";
}
?>
