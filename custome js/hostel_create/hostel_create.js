//
/*
fetch
('/html/hostel/hostel_create_model.html')
.then(response => response.text())
.then(data => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/html');
  document.getElementById('modalHostelContainer').innerHTML = doc.getElementById('modalHostelContainer').innerHTML;
})
*/
fetch
('/html/hostel/hostel_create_model.html')
.then(response => response.text())
.then(data => {
  document.getElementById('modalHostelContainer').innerHTML = data;
});
