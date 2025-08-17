
const API_BASE = window.LEADHUNTERAI_BACKEND || "";

async function doSearch() {
  const keyword = document.getElementById('keyword').value.trim();
  const platformsSel = document.getElementById('platforms');
  const platforms = Array.from(platformsSel.selectedOptions).map(o => o.value).join(',');
  const resultsEl = document.getElementById('results');
  resultsEl.innerHTML = '<div class="text-sm text-gray-500">Searching…</div>';
  try {
    const res = await fetch(`${API_BASE}/search?keyword=${encodeURIComponent(keyword)}&platforms=${encodeURIComponent(platforms)}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      resultsEl.innerHTML = '<div class="text-sm text-gray-500">No results found. Try different keywords like "looking for a ____".</div>';
      return;
    }
    resultsEl.innerHTML = data.map(item => `
      <div class="p-4 border rounded flex items-start justify-between gap-4">
        <div>
          <div class="text-xs uppercase text-gray-500">${item.platform}</div>
          <a href="${item.url}" target="_blank" rel="noreferrer" class="font-semibold hover:underline">${item.title}</a>
          <p class="text-sm text-gray-700">${item.snippet || ''}</p>
        </div>
        <button class="px-3 py-2 text-sm border rounded" onclick="prefillMessage('${item.title.replace(/'/g, "\'")}')">Use as context</button>
      </div>
    `).join('');
  } catch (e) {
    resultsEl.innerHTML = '<div class="text-sm text-red-600">Search failed. If your backend is on Render/Railway, ensure CORS is enabled or use the correct URL in config.js.</div>';
  }
}

function prefillMessage(text) {
  document.getElementById('context').value = text;
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

async function genMessage() {
  const service = document.getElementById('service').value;
  const prospect_context = document.getElementById('context').value;
  const tone = document.getElementById('tone').value;
  const location = document.getElementById('location').value;
  const res = await fetch(`${API_BASE}/generate_message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ service, prospect_context, tone, location })
  });
  const data = await res.json();
  document.getElementById('msgOut').textContent = data.message || 'No message generated.';
}

document.getElementById('searchBtn').addEventListener('click', doSearch);
document.getElementById('genBtn').addEventListener('click', genMessage);
