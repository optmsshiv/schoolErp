document.addEventListener("DOMContentLoaded", function() {
  fetch("/html/transport_html/transport_driver.html")
      .then(response => response.text())
      .then(data => {
          document.getElementById("offcanvasDriver").innerHTML = data;
      });
});
