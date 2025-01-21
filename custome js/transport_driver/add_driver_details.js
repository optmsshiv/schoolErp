$(document).ready(function () {
            $("#driverForm").on("submit", function (e) {
                e.preventDefault();

                // Gather form data
                const formData = {
                    driver_aadhar: $("#driver_aadhar").val(),
                    driver_name: $("#driver_name").val(),
                    driver_mobile: $("#driver_mobile").val(),
                    vehicle_name: $("#vehicle_name").val(),
                    vehicle_number: $("#vehicle_number").val(),
                    driver_address: $("#driver_address").val(),
                    driver_status: $("#driver_status").val()
                };

                // Send AJAX request
                $.ajax({
                    url: "/php/driverAdd/add_driver.php",
                    type: "POST",
                    data: JSON.stringify(formData),
                    contentType: "application/json",
                    success: function (response) {
                        if (response.status === "success") {
                            $("#responseMessage").html(
                                `<div class="alert alert-success">${response.message}</div>`
                            );
                            $("#driverForm")[0].reset();
                        } else {
                            $("#responseMessage").html(
                                `<div class="alert alert-danger">${response.message}</div>`
                            );
                        }
                    },
                    error: function () {
                        $("#responseMessage").html(
                            `<div class="alert alert-danger">An error occurred. Please try again.</div>`
                        );
                    }
                });
            });
        });


