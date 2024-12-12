// Toggle visibility of Day Scholar and Hostel fields based on Student Type selection
    document.getElementById('student-type').addEventListener('change', function() {
        var studentType = this.value;
        if (studentType === 'day_scholar') {
            document.getElementById('day-scholar').disabled = false;
            document.getElementById('hostel').disabled = true;
        } else if (studentType === 'hostel') {
            document.getElementById('hostel').disabled = false;
            document.getElementById('day-scholar').disabled = true;
        }
    });
