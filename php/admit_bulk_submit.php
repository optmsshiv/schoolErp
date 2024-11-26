<?php
// Include the database connection
require '../php/db_connection.php';

header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    if (isset($_POST['tableData'])) {
        $data = json_decode($_POST['tableData'], true);

        if (is_array($data) && !empty($data)) {
            $stmt = $pdo->prepare("
                INSERT INTO students (
                    serial_number, first_name, last_name, phone, email, date_of_birth, gender, class_name, category, religion, guardian, handicapped,
                    father_name, mother_name, roll_no, sr_no, pen_no, aadhar_no, admission_no, admission_date, day_hosteler, user_id,
                    father_occupation, father_income, father_phone, father_email, father_aadhar,
                    mother_occupation, mother_income, mother_phone, current_add, permanent_add, city_name, pincode, state, landmark
                ) VALUES (
                    :serial_number, :first_name, :last_name, :phone, :email, :date_of_birth, :gender, :class_name, :category, :religion, :guardian, :handicapped,
                    :father_name, :mother_name, :roll_no, :sr_no, :pen_no, :aadhar_no, :admission_no, :admission_date, :day_hosteler, :user_id,
                    :father_occupation, :father_income, :father_phone, :father_email, :father_aadhar,
                    :mother_occupation, :mother_income, :mother_phone, :current_add, :permanent_add, :city_name, :pincode, :state, :landmark
                )
            ");

            foreach ($data as $row) {
                // Generate user ID with first four letters of first_name + random 4-digit number
                $user_id = strtoupper(substr($row['first_name'], 0, 4)) . str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT);

                $stmt->execute([
                    ':serial_number' => $row['serial_number'],
                    ':first_name' => $row['first_name'],
                    ':last_name' => $row['last_name'],
                    ':phone' => $row['phone'],
                    ':email' => $row['email'],
                    ':date_of_birth' => $row['date_of_birth'],
                    ':gender' => $row['gender'],
                    ':class_name' => $row['class_name'],
                    ':category' => $row['category'],
                    ':religion' => $row['religion'],
                    ':guardian' => $row['guardian'],
                    ':handicapped' => $row['handicapped'],
                    ':father_name' => $row['father_name'],
                    ':mother_name' => $row['mother_name'],
                    ':roll_no' => $row['roll_no'],
                    ':sr_no' => $row['sr_no'],
                    ':pen_no' => $row['pen_no'],
                    ':aadhar_no' => $row['aadhar_no'],
                    ':admission_no' => $row['admission_no'],
                    ':admission_date' => $row['admission_date'],
                    ':day_hosteler' => $row['day_hosteler'],
                    ':user_id' => $user_id,
                    ':father_occupation' => $row['father_occupation'],
                    ':father_income' => $row['father_income'],
                    ':father_phone' => $row['father_phone'],
                    ':father_email' => $row['father_email'],
                    ':father_aadhar' => $row['father_aadhar'],
                    ':mother_occupation' => $row['mother_occupation'],
                    ':mother_income' => $row['mother_income'],
                    ':mother_phone' => $row['mother_phone'],
                    ':current_add' => $row['current_add'],
                    ':permanent_add' => $row['permanent_add'],
                    ':city_name' => $row['city_name'],
                    ':pincode' => $row['pincode'],
                    ':state' => $row['state'],
                    ':landmark' => $row['landmark']
                ]);
            }

            echo json_encode(['success' => true, 'message' => 'Data uploaded successfully!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid data format.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'No data received.']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
