<?php
// save_enquiry.php
session_start();
global $pdo;
header('Content-Type: application/json');
require '../db_connection.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
  echo json_encode(['status'=>'error','message'=>'Invalid input']);
  exit;
}

$first = trim($input['first_name'] ?? '');
$last = trim($input['last_name'] ?? '');
$father = trim($input['father_name'] ?? '');
$mother = trim($input['mother_name'] ?? '');
$class = trim($input['class_name'] ?? '');
$mobile = trim($input['mobile'] ?? '');
$dob = $input['dob'] ? $input['dob'] : null;
$gender = trim($input['gender'] ?? '');
$address = trim($input['address'] ?? '');
$enquiry_date = $input['enquiry_date'] ? $input['enquiry_date'] : null;
$enquiry_no = trim($input['enquiry_no'] ?? '');

// Ensure required
if ($first === '' || $mobile === '') {
  echo json_encode(['status'=>'error','message'=>'First name and mobile are required']);
  exit;
}

// If enquiry_no empty generate server-side unique one
if ($enquiry_no === '') {
  $enquiry_no = 'ENQ-' . date('ymd') . '-' . rand(1000,9999);
}

// created_by from session (adjust according to your auth)
// created_by from login session
// $created_by = $_SESSION['user_id'] ?? null;
// $created_by_name = $_SESSION['username'] ?? null;
// $created_by = $_POST['created_by'] ?? ($_SESSION['username'] ?? 'system');
// Use correct session fields from your login
 $created_by = $_SESSION['user_id'] ?? null;       // stores user ID
// $created_by_name = $_SESSION['username'] ?? 'system';  // stores username
$created_by_name = $input['created_by_name'] ?? 'system';


try {
  // ensure unique enquiry_no — if conflict append random
  $stmt = $pdo->prepare("SELECT COUNT(*) FROM admission_enquiry WHERE enquiry_no = ?");
  $candidate = $enquiry_no;
  $i = 0;
  while (true) {
    $stmt->execute([$candidate]);
    if ($stmt->fetchColumn() == 0) break;
    $candidate = $enquiry_no . '-' . rand(10,99);
    if (++$i > 5) break;
  }
  $enquiry_no = $candidate;

  $sql = "INSERT INTO admission_enquiry
        (enquiry_no, first_name, last_name, father_name, mother_name, class_name, mobile, dob, gender, address, enquiry_date, created_by, created_by_name)
        VALUES (:enquiry_no, :first, :last, :father, :mother, :class, :mobile, :dob, :gender, :address, :enquiry_date, :created_by, :created_by_name)";
  $stmt = $pdo->prepare($sql);
  $stmt->execute([
    ':enquiry_no' => $enquiry_no,
    ':first' => $first,
    ':last' => $last,
    ':father' => $father,
    ':mother' => $mother,
    ':class' => $class,
    ':mobile' => $mobile,
    ':dob' => $dob,
    ':gender' => $gender,
    ':address' => $address,
    ':enquiry_date' => $enquiry_date,
    ':created_by' => $created_by,
    ':created_by_name' => $created_by_name
  ]);
  echo json_encode(['status'=>'success','message'=>'Enquiry saved','id'=>$pdo->lastInsertId()]);
} catch (Exception $e) {
  echo json_encode(['status'=>'error','message'=>$e->getMessage()]);
}
