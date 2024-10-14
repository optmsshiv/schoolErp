document.addEventListener("DOMContentLoaded", function() {
  fetch("../model/offCanvas.html")
      .then(response => response.text())
      .then(data => {
          document.getElementById("offcanvasPlaceholder").innerHTML = data;
      });
});


/**********Data table js*****************/
