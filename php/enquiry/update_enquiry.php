<?php
// update_enquiry.php
header('Content-Type: application/json');
require '../db_connection.php';
session_start();

global $pdo;

$id = (int)($_GET['id'] ?? 0);
$input = json_decode(file_get_contents('php://input'), true);

if ($id <= 0 || !$input) {
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

if ($first === '' || $mobile === '') {
  echo json_encode(['status'=>'error','message'=>'First name and mobile are required']);
  exit;
}

try {
  // If updating enquiry_no ensure uniqueness
  if ($enquiry_no !== '') {
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM admission_enquiry WHERE enquiry_no = ? AND id <> ?");
    $stmt->execute([$enquiry_no, $id]);
    if ($stmt->fetchColumn() > 0) {
      $enquiry_no .= '-' . rand(10,99); // make unique
    }
  }

  $sql = "UPDATE admission_enquiry SET
            enquiry_no = :enquiry_no,
            first_name = :first,
            last_name = :last,
            father_name = :father,
            mother_name = :mother,
            class_name = :class,
            mobile = :mobile,
            dob = :dob,
            gender = :gender,
            address = :address,
            enquiry_date = :enquiry_date
            WHERE id = :id";
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
    ':id' => $id
  ]);

  echo json_encode(['status'=>'success','message'=>'Enquiry updated']);
} catch (Exception $e) {
  echo json_encode(['status'=>'error','message'=>$e->getMessage()]);
}
