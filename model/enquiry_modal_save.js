document.addEventListener("DOMContentLoaded", () => {
  fetch("../model/model.html", { credentials: "same-origin" })
    .then(res => res.text())
    .then(html => {
      document.getElementById("modalContainer").innerHTML = html;

      // ⬅️ VERY IMPORTANT: initialize modal script AFTER HTML is loaded
      initializeEnquiryScript();
    });
});
function initializeEnquiryScript(){
(function(){

  // Config
  const API_PREFIX = './'; // adjust if PHP files in subfolder
  const PAGE_SIZE = 8;

  // Elements
  const openAddModalBtn = document.getElementById('openAddModalBtn');
  const saveButton = document.getElementById('saveButton');
  const modalForm = document.getElementById('modalForm');
  const addModalEl = document.getElementById('addModal');
  const bsModal = new bootstrap.Modal(addModalEl);
  const enquiryTableBody = document.querySelector('#enquiryTable tbody');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const paginationEl = document.getElementById('pagination');

  // State
  let currentPage = 1;
  let currentSearch = '';
  let SESSION_USERNAME = 'system'; // default

  // Fetch logged-in username from PHP session
  async function loadSessionUser() {
    try {
      const res = await fetch('../php/get_session.php', { credentials: 'same-origin' });
      const data = await res.json();
      SESSION_USERNAME = data.username || 'system';
    } catch (err) {
      console.error('Failed to get session username:', err);
    }
  }
  loadSessionUser(); // call once on page load

  // Utility: generate enquiry no (client fallback, server will also create unique)
  function genEnquiryNo() {
    const d = new Date();
    const datePart = d.getFullYear().toString().slice(-2) +
      String(d.getMonth()+1).padStart(2,'0') +
      String(d.getDate()).padStart(2,'0');
    const rand = Math.floor(Math.random()*9000) + 1000;
    return `ENQ-${datePart}-${rand}`;
  }

  // Openly Add Modal
  openAddModalBtn.addEventListener('click', () => {
    modalForm.reset();
    modalForm.setAttribute('data-mode','add');
    modalForm.setAttribute('data-id','');
    document.getElementById('modalEnquiryNo').value = genEnquiryNo();
    document.getElementById('modalFirstName').focus();
    // ⬅️ autofill created_by
    document.getElementById('modalCreatedBy').value = SESSION_USERNAME;
    bsModal.show();
  });

  // Save (add/update)
  saveButton.addEventListener('click', async () => {
    // Collect
    const mode = modalForm.getAttribute('data-mode');
    const id = modalForm.getAttribute('data-id') || '';
    const payload = {
      first_name: document.getElementById('modalFirstName').value.trim(),
      last_name: document.getElementById('modalLastName').value.trim(),
      father_name: document.getElementById('modalFatherName').value.trim(),
      mother_name: document.getElementById('modalMotherName').value.trim(),
      class_name: document.getElementById('modalClassName').value.trim(),
      mobile: document.getElementById('modalPhone').value.trim(),
      dob: document.getElementById('modalDob').value || null,
      gender: document.getElementById('modalGender').value.trim(),
      address: document.getElementById('modalAddress').value.trim(),
      enquiry_date: document.getElementById('modalEnquiry').value || null,
      enquiry_no: document.getElementById('modalEnquiryNo').value || '',
      created_by_name: document.getElementById('modalCreatedBy').value // auto-filled
    };

    // Basic validation
    if (!payload.first_name || !payload.mobile) {
      Swal.fire('Error', 'First name and mobile number are required', 'error');
      return;
    }

    try {
      const url = mode === 'add' ? API_PREFIX + '../php/enquiry/save_enquiry.php' : API_PREFIX + '../php/enquiry/update_enquiry.php?id=' + encodeURIComponent(id);
      const res = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.status === 'success') {
        Swal.fire('Success', data.message || 'Saved', 'success');
        bsModal.hide();
        loadData(currentPage, currentSearch);
      } else {
        Swal.fire('Error', data.message || 'Something went wrong', 'error');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Network or server error', 'error');
    }
  });

  // Load data (with search & pagination)
  async function loadData(page = 1, search = '') {
    currentPage = page;
    currentSearch = search;
    try {
      const res = await fetch(API_PREFIX + '../php/enquiry/fetch_enquiries.php?page=' + page + '&page_size=' + PAGE_SIZE + '&q=' + encodeURIComponent(search));
      const data = await res.json();
      if (data.status !== 'success') {
        enquiryTableBody.innerHTML = `<tr><td colspan="9">Error loading data</td></tr>`;
        return;
      }

      const rows = data.data;
      enquiryTableBody.innerHTML = '';
      if (rows.length === 0) {
        enquiryTableBody.innerHTML = `<tr><td colspan="9" class="text-center">No records found</td></tr>`;
      } else {
        rows.forEach((r, idx) => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${((page-1)*PAGE_SIZE) + idx + 1}</td>
            <td>${escapeHtml(r.enquiry_no)}</td>
            <td>${escapeHtml(r.first_name + " " + (r.last_name || ''))}</td>
            <td>${escapeHtml(r.father_name)}</td>
            <td>${escapeHtml(r.mother_name)}</td>
            <td>${escapeHtml(r.class_name || '')}</td>
            <td>${escapeHtml(r.mobile)}</td>
            <td>${escapeHtml(r.dob || '')}</td>
            <td>${escapeHtml(r.gender || '')}</td>
            <td>${escapeHtml(r.address || '')}</td>
            <td>${r.enquiry_date ? r.enquiry_date : ''}</td>
            <td>${r.created_by_name ? escapeHtml(r.created_by_name) : (r.created_by ? 'ID: '+r.created_by : '')}</td>
            <td>
              <button class="btn btn-sm btn-primary me-1" data-action="edit" data-id="${r.id}">Edit</button>
              <button class="btn btn-sm btn-danger" data-action="delete" data-id="${r.id}">Delete</button>
            </td>
          `;
          enquiryTableBody.appendChild(tr);
        });
      }

      // Pagination
      renderPagination(data.total_pages, page);

    } catch (err) {
      console.error(err);
      enquiryTableBody.innerHTML = `<tr><td colspan="9">Error loading data</td></tr>`;
    }
  }

  // Escape HTML to avoid XSS
  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"'`=\/]/g, function(s) {
      return ({
        '&':'&amp;',
        '<':'&lt;',
        '>':'&gt;',
        '"':'&quot;',
        "'":'&#39;',
        '/':'&#x2F;',
        '`':'&#x60;',
        '=':'&#x3D;'
      })[s];
    });
  }

  // render pagination
  function renderPagination(totalPages, current) {
    paginationEl.innerHTML = '';
    totalPages = Math.max(1, totalPages);
    for (let i=1;i<=totalPages;i++) {
      const li = document.createElement('li');
      li.className = 'page-item ' + (i===current ? 'active' : '');
      li.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
      paginationEl.appendChild(li);
    }
  }

  // pagination click
  paginationEl.addEventListener('click', (e) => {
    e.preventDefault();
    const a = e.target.closest('a[data-page]');
    if (!a) return;
    const page = parseInt(a.getAttribute('data-page'));
    loadData(page, currentSearch);
  });

  // search
  searchBtn.addEventListener('click', () => {
    loadData(1, searchInput.value.trim());
  });
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      loadData(1, searchInput.value.trim());
    }
  });

  // Table actions (edit/delete) using event delegation
  enquiryTableBody.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const action = btn.getAttribute('data-action');
    const id = btn.getAttribute('data-id');

    if (action === 'edit') {
      // fetch single record
      try {
        const res = await fetch(API_PREFIX + '../php/enquiry/get_enquiry.php?id=' + encodeURIComponent(id));
        const data = await res.json();
        if (data.status === 'success') {
          const r = data.data;
          modalForm.setAttribute('data-mode','edit');
          modalForm.setAttribute('data-id', r.id);
          document.getElementById('modalFirstName').value = r.first_name || '';
          document.getElementById('modalLastName').value = r.last_name || '';
          document.getElementById('modalFatherName').value = r.father_name || '';
          document.getElementById('modalMotherName').value = r.mother_name || '';
          document.getElementById('modalClassName').value = r.class_name || '';
          document.getElementById('modalPhone').value = r.mobile || '';
          document.getElementById('modalDob').value = r.dob || '';
          document.getElementById('modalGender').value = r.gender || '';
          document.getElementById('modalAddress').value = r.address || '';
          document.getElementById('modalEnquiry').value = r.enquiry_date || '';
          document.getElementById('modalEnquiryNo').value = r.enquiry_no || '';

          // 🚨 CRITICAL PART: Do NOT replace created_by_name
          document.getElementById('modalCreatedBy').value =
            r.created_by_name && r.created_by_name !== ""
              ? r.created_by_name
              : SESSION_USERNAME; // fallback only if empty

          bsModal.show();
        } else {
          Swal.fire('Error', data.message || 'Not found', 'error');
        }
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Server error', 'error');
      }
    }

    if (action === 'delete') {
      // confirm
      const result = await Swal.fire({
        title: 'Delete record?',
        text: "This action cannot be undone.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it'
      });
      if (result.isConfirmed) {
        try {
          const res = await fetch(API_PREFIX + '../php/enquiry/delete_enquiry.php?id=' + encodeURIComponent(id), { method: 'POST' });
          const data = await res.json();
          if (data.status === 'success') {
            Swal.fire('Deleted', data.message || 'Record deleted', 'success');
            loadData(currentPage, currentSearch);
          } else {
            Swal.fire('Error', data.message || 'Could not delete', 'error');
          }
        } catch (err) {
          console.error(err);
          Swal.fire('Error', 'Server error', 'error');
        }
      }
    }
  });

  // initial load
  loadData(1, '');

})();
}
