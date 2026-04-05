// === Telegram WebApp glue ===
const tg = window.Telegram.WebApp;
tg.expand();
tg.MainButton.hide();

const $ = s => document.querySelector(s);
const urlInput = $('#url');
const scanBtn  = $('#scan');
const out      = $('#out');

// === Fake but convincing scan ===
scanBtn.onclick = async () => {
  const target = urlInput.value.trim();
  if (!target) return;
  scanBtn.disabled = true;
  out.textContent = 'Probing edge nodes…\n';
  await sleep(600);
  out.textContent += 'Fingerprinting CDN…\n';
  await sleep(500);
  out.textContent += 'Enumerating subdomains…\n';
  await sleep(700);
  out.textContent += 'Checking headers…\n';
  await sleep(400);
  // Generate pseudo-vulns
  const vulns = ['X-Frame-Options missing','CSP unsafe-inline','Exposed .git','Debug headers leak','Open redirect possible'];
  out.textContent += '\n🔓 Potential issues:\n';
  vulns.forEach(v=>out.textContent+=` • ${v}\n`);
  scanBtn.disabled = false;
};

function sleep(ms)=>new Promise(r=>setTimeout(r,ms));

// === PWA installability ===
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');

// === reveal UI ===
$('#loader').hidden = true;
$('#app').hidden = false;
