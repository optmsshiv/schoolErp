document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("addDriverDetails");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Collect form data
        const formData = new FormData(form);

        // Send AJAX request
        fetch("/php/driverAdd/add_driver.php ", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: data.message,
                    });
                    form.reset(); // Reset form fields
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: data.message,
                    });
                }
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "An error occurred. Please try again.",
                });
                console.error("Error:", error);
            });
    });
});
