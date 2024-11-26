document.addEventListener('DOMContentLoaded', () => {
  // Check if the table HTML is stored in session storage
  const storedTableHTML = sessionStorage.getItem('studentDataTable');

  if (storedTableHTML) {
    // Populate the `student_fee_data` table with the stored HTML
    const feeTable = document.getElementById('student_fee_data');
    feeTable.innerHTML = storedTableHTML;

    // Optional: Clear the session storage after populating
    sessionStorage.removeItem('studentDataTable');
  } else {
    console.error('No data found for the student fee table.');
  }
});
