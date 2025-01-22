document.addEventListener("DOMContentLoaded", function() {
  fetch("/html/transport_html/transport_driver.html")
      .then(response => response.text())
      .then(data => {
          document.getElementById("offcanvasDriver").innerHTML = data;
      });
});
<script src="../custome js/transport_driver/add_driver_details.js"></script>
