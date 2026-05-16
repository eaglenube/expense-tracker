// Sidebar toggle for mobile
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('appSidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => sidebar.classList.toggle('show'));
  }

  // Auto-hide toasts after 4s
  document.querySelectorAll('.toast').forEach((el) => {
    setTimeout(() => {
      try { bootstrap.Toast.getOrCreateInstance(el).hide(); } catch (e) {}
    }, 4500);
  });

  // Confirm delete forms
  document.querySelectorAll('form[data-confirm]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      const msg = form.getAttribute('data-confirm') || 'Are you sure?';
      if (!window.confirm(msg)) e.preventDefault();
    });
  });

  // Drag and drop upload zones
  document.querySelectorAll('.upload-drop').forEach((zone) => {
    const input = zone.querySelector('input[type="file"]');
    if (!input) return;
    zone.addEventListener('click', () => input.click());
    ['dragenter', 'dragover'].forEach((ev) =>
      zone.addEventListener(ev, (e) => { e.preventDefault(); zone.classList.add('dragover'); })
    );
    ['dragleave', 'drop'].forEach((ev) =>
      zone.addEventListener(ev, (e) => { e.preventDefault(); zone.classList.remove('dragover'); })
    );
    zone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files.length) {
        input.files = e.dataTransfer.files;
        updateFileLabel(zone, input.files[0]);
      }
    });
    input.addEventListener('change', () => {
      if (input.files[0]) updateFileLabel(zone, input.files[0]);
    });
  });

  function updateFileLabel(zone, file) {
    const label = zone.querySelector('.upload-label');
    if (label) label.textContent = file.name + ' • ' + (file.size / 1024).toFixed(1) + ' KB';
  }

  // Loading state on submit
  document.querySelectorAll('form[data-loading]').forEach((form) => {
    form.addEventListener('submit', () => {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        const original = btn.innerHTML;
        btn.dataset.original = original;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving…';
      }
    });
  });
});
