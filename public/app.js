// Clarity CRM — Frontend Logic
const $ = id => document.getElementById(id);
let toastTimer, searchTimer;

// Eye-Care Theme Manager (Night & Day Modes)
function getInitialTheme() {
  const saved = localStorage.getItem('clarity_theme');
  if (saved) return saved;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('clarity_theme', theme);
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');
  const themeLabel = $('themeLabel');

  if (theme === 'dark') {
    if (sunIcon) sunIcon.classList.add('hidden');
    if (moonIcon) moonIcon.classList.remove('hidden');
    if (themeLabel) themeLabel.textContent = 'Day Mode';
  } else {
    if (sunIcon) sunIcon.classList.remove('hidden');
    if (moonIcon) moonIcon.classList.add('hidden');
    if (themeLabel) themeLabel.textContent = 'Eye-Care Mode';
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  toast(next === 'dark' ? 'Eye-Care Night Mode enabled' : 'Calm Day Mode enabled');
  leads(); // Re-render avatars with matching contrast
}

if ($('themeToggle')) {
  $('themeToggle').onclick = toggleTheme;
}

// Initial theme apply
applyTheme(getInitialTheme());

// Eye-friendly avatar color palettes
const AVATAR_PALETTES = [
  { bg: '#e0e7ff', text: '#4338ca', darkBg: 'rgba(99, 102, 241, 0.25)', darkText: '#c7d2fe' },
  { bg: '#dbeafe', text: '#1d4ed8', darkBg: 'rgba(59, 130, 246, 0.25)', darkText: '#bfdbfe' },
  { bg: '#e0f2fe', text: '#0369a1', darkBg: 'rgba(2, 132, 199, 0.25)', darkText: '#bae6fd' },
  { bg: '#fef3c7', text: '#b45309', darkBg: 'rgba(217, 119, 6, 0.25)', darkText: '#fde68a' },
  { bg: '#fce7f3', text: '#be185d', darkBg: 'rgba(236, 72, 153, 0.25)', darkText: '#fbcfe8' },
  { bg: '#ede9fe', text: '#6d28d9', darkBg: 'rgba(124, 58, 237, 0.25)', darkText: '#ddd6fe' },
  { bg: '#dcfce7', text: '#15803d', darkBg: 'rgba(22, 163, 74, 0.25)', darkText: '#bbf7d0' },
  { bg: '#ffedd5', text: '#c2410c', darkBg: 'rgba(234, 88, 12, 0.25)', darkText: '#fed7aa' }
];

function getAvatarStyle(name) {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_PALETTES.length;
  const p = AVATAR_PALETTES[index];
  if (isDark) {
    return { bg: p.darkBg, text: p.darkText };
  }
  return { bg: p.bg, text: p.text };
}

function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}

async function api(url, opts = {}) {
  const r = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw Error(d.error || 'Something went wrong.');
  return d;
}

function toast(msg, isError = false) {
  const t = $('toast');
  const icon = $('toastIcon');
  const msgEl = $('toastMsg');

  msgEl.textContent = msg;
  if (isError) {
    t.classList.add('toast-error');
    icon.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  } else {
    t.classList.remove('toast-error');
    icon.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  }

  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

// Update KPI stats & conversion progress
async function summary() {
  const d = await api('/api/dashboard');
  const total = d.total ?? 0;
  const newCount = d.new ?? 0;
  const contacted = d.contacted ?? 0;
  const converted = d.converted ?? 0;

  $('total').textContent = total;
  $('new').textContent = newCount;
  $('contacted').textContent = contacted;
  $('converted').textContent = converted;

  // Nav pills & tabs
  if ($('navLeadCount')) $('navLeadCount').textContent = total;
  $('tabAll').textContent = total;
  $('tabNew').textContent = newCount;
  $('tabContacted').textContent = contacted;
  $('tabConverted').textContent = converted;

  // Conversion rate calculation
  const rate = total > 0 ? Math.round((converted / total) * 100) : 0;
  $('conversionRate').textContent = `${rate}% Win Rate`;
  $('widgetRate').textContent = `${rate}%`;
  $('widgetProgress').style.width = `${rate}%`;
  $('widgetConverted').textContent = converted;
  $('widgetTotal').textContent = total;
}

// Render leads table
async function leads() {
  const tbody = $('rows');
  const searchVal = $('search').value.trim();
  const statusVal = $('filter').value;

  // Toggle clear search button
  $('clearSearch').classList.toggle('hidden', !searchVal);

  // Only show loading state if table is empty
  if (!tbody.children.length || tbody.querySelector('.table-loading')) {
    tbody.innerHTML = `<tr><td colspan="5" class="table-loading"><div class="loading-spinner"></div><span>Loading leads...</span></td></tr>`;
  }

  try {
    const q = new URLSearchParams({ search: searchVal, status: statusVal });
    const list = await api('/api/leads?' + q);

    $('count').textContent = `Showing ${list.length} lead${list.length === 1 ? '' : 's'}`;
    $('tableBadge').textContent = `${list.length} lead${list.length === 1 ? '' : 's'}`;

    if (!list.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="empty-state">
            <div class="empty-state-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <div class="empty-state-title">No matching leads found</div>
            <p class="empty-state-desc">${searchVal || statusVal ? 'Try adjusting your search terms or filter selection.' : 'Get started by adding your first prospect or load demo data.'}</p>
            <div style="display:inline-flex; gap:8px;">
              ${searchVal || statusVal ? `<button class="btn btn-secondary" onclick="resetFilters()">Clear Filters</button>` : `<button class="btn btn-primary" onclick="openForm()">＋ Add Lead</button>`}
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map(item => {
      const palette = getAvatarStyle(item.name);
      const initials = getInitials(item.name);

      return `
        <tr>
          <td class="td-contact">
            <div class="contact-cell">
              <div class="avatar-initials" style="background-color: ${palette.bg}; color: ${palette.text};">
                ${initials}
              </div>
              <div class="contact-meta">
                <span class="contact-name">${esc(item.name)}</span>
                <a href="mailto:${esc(item.email)}" class="contact-email">${esc(item.email)}</a>
              </div>
            </div>
          </td>
          <td>
            <div class="company-cell">
              <svg class="company-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              <span>${esc(item.businessName)}</span>
            </div>
          </td>
          <td>
            <a href="tel:${esc(item.phone)}" class="phone-cell">
              <svg class="phone-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>${esc(item.phone)}</span>
            </a>
          </td>
          <td>
            <span class="status-pill ${esc(item.status)}">
              <span class="dot"></span>
              <span>${esc(item.status)}</span>
            </span>
          </td>
          <td>
            <div class="table-actions">
              <button class="action-btn btn-edit" data-edit="${item.id}" title="Edit lead details">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                <span>Edit</span>
              </button>
              <button class="action-btn btn-delete" data-delete="${item.id}" title="Delete lead">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                <span>Delete</span>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="5" class="table-loading" style="color:#ef4444">${esc(e.message)}</td></tr>`;
  }
}

async function refresh() {
  try {
    await Promise.all([summary(), leads()]);
  } catch (e) {
    toast(e.message, true);
  }
}

// Reset search and filters
window.resetFilters = function() {
  $('search').value = '';
  $('filter').value = '';
  updateActiveTab('');
  leads();
};

function updateActiveTab(status) {
  document.querySelectorAll('#statusTabs .tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.status === status);
  });
}

// Modal handling
function openForm(lead) {
  $('leadForm').reset();
  $('error').textContent = '';
  $('error').classList.add('hidden');
  $('leadId').value = lead?.id || '';
  $('formTitle').textContent = lead ? 'Edit Lead Details' : 'Add a New Lead';
  $('save').textContent = lead ? 'Update Lead' : 'Save Lead';

  if (lead) {
    $('name').value = lead.name || '';
    $('email').value = lead.email || '';
    $('phone').value = lead.phone || '';
    $('business').value = lead.businessName || '';
    $('status').value = lead.status || 'New';
  } else {
    $('status').value = 'New';
  }

  $('overlay').classList.remove('hidden');
  setTimeout(() => $('name').focus(), 50);
}

function closeForm() {
  $('overlay').classList.add('hidden');
  $('error').textContent = '';
  $('error').classList.add('hidden');
}

// Form submit
$('leadForm').onsubmit = async e => {
  e.preventDefault();
  $('error').textContent = '';
  $('error').classList.add('hidden');

  const id = $('leadId').value;
  const body = {
    name: $('name').value.trim(),
    email: $('email').value.trim(),
    phone: $('phone').value.trim(),
    businessName: $('business').value.trim(),
    status: $('status').value
  };

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    $('error').textContent = 'Please enter a valid email address.';
    $('error').classList.remove('hidden');
    return;
  }

  $('save').disabled = true;
  $('save').textContent = id ? 'Updating...' : 'Saving...';

  try {
    await api(id ? `/api/leads/${id}` : '/api/leads', {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(body)
    });
    closeForm();
    toast(id ? 'Lead successfully updated!' : 'New lead successfully added!');
    await refresh();
  } catch (err) {
    $('error').textContent = err.message;
    $('error').classList.remove('hidden');
  } finally {
    $('save').disabled = false;
    $('save').textContent = id ? 'Update Lead' : 'Save Lead';
  }
};

// Row click delegation (Edit & Delete)
$('rows').onclick = async e => {
  const editBtn = e.target.closest('[data-edit]');
  const delBtn = e.target.closest('[data-delete]');

  try {
    if (editBtn) {
      const id = editBtn.dataset.edit;
      const lead = await api('/api/leads/' + id);
      if (lead) openForm(lead);
    }
    if (delBtn) {
      const id = delBtn.dataset.delete;
      if (confirm('Are you sure you want to remove this lead?')) {
        await api('/api/leads/' + id, { method: 'DELETE' });
        toast('Lead deleted from pipeline.');
        await refresh();
      }
    }
  } catch (err) {
    toast(err.message, true);
  }
};

// Status tabs click
$('statusTabs').onclick = e => {
  const btn = e.target.closest('.tab-btn');
  if (!btn) return;
  const status = btn.dataset.status;
  $('filter').value = status;
  updateActiveTab(status);
  leads();
};

// Status dropdown change
$('filter').onchange = () => {
  updateActiveTab($('filter').value);
  leads();
};

// Search debouncing
$('search').oninput = () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(leads, 200);
};

// Clear search
$('clearSearch').onclick = () => {
  $('search').value = '';
  $('clearSearch').classList.add('hidden');
  leads();
  $('search').focus();
};

// Export to CSV
$('exportBtn').onclick = async () => {
  try {
    const leadsList = await api('/api/leads');
    if (!leadsList.length) {
      toast('No leads available to export.', true);
      return;
    }

    const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Status', 'Created At'];
    const rows = leadsList.map(l => [
      l.id,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.businessName || '').replace(/"/g, '""')}"`,
      `"${(l.status || '').replace(/"/g, '""')}"`,
      `"${(l.createdAt || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_pipeline_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast('Leads exported to CSV spreadsheet!');
  } catch (err) {
    toast('Export failed: ' + err.message, true);
  }
};

// Modal open/close listeners
$('addTop').onclick = () => openForm();
$('addMobile').onclick = () => openForm();
$('close').onclick = closeForm;
$('cancel').onclick = closeForm;
$('overlay').onclick = e => { if (e.target === $('overlay')) closeForm(); };
document.onkeydown = e => {
  if (e.key === 'Escape') closeForm();
};

// Format Current Date
if ($('currentDate')) {
  const now = new Date();
  $('currentDate').textContent = '· ' + now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// Initial load
refresh();
