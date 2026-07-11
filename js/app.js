// ===== AI Agent Hub - Core App =====
const App = {
  config: {
    deepseekKey: localStorage.getItem('deepseek_key') || '',
    deepseekUrl: localStorage.getItem('deepseek_url') || 'https://api.deepseek.com',
    deepseekModel: localStorage.getItem('deepseek_model') || 'deepseek-chat',
    cellclawUrl: localStorage.getItem('cellclaw_url') || '',
    cellclawKey: localStorage.getItem('cellclaw_key') || '',
    taskerUrl: localStorage.getItem('tasker_url') || '',
    mcpHost: localStorage.getItem('mcp_host') || 'ws://localhost:8080/mcp',
    mcpReconnect: localStorage.getItem('mcp_reconnect') !== 'false',
    theme: localStorage.getItem('theme') || 'light'
  },
  init() {
    this.applyTheme();
    this.setupNavigation();
    this.setupStatusButton();
    this.checkFirstRun();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
    }
  },
  applyTheme() {
    const t = this.config.theme;
    document.documentElement.className = t === 'auto' ? 'auto' : (t === 'light' ? 'light' : '');
  },
  setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const page = item.dataset.page;
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        pages.forEach(p => p.classList.remove('active'));
        const target = document.getElementById('page-' + page);
        if (target) { target.classList.add('active'); document.getElementById('main-content').scrollTop = 0; }
      });
    });
    document.querySelectorAll('.action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const a = btn.dataset.action;
        const ni = document.querySelector('.nav-item[data-page="' + a + '"]');
        if (ni) ni.click();
      });
    });
  },
  setupStatusButton() {
    document.getElementById('btn-status').addEventListener('click', () => this.checkAllServices());
  },
  async checkAllServices() {
    const results = [];
    if (this.config.deepseekKey) {
      try {
        const r = await fetch(this.config.deepseekUrl + '/v1/models', { headers: { Authorization: 'Bearer ' + this.config.deepseekKey } });
        results.push({ name: 'DeepSeek', status: r.ok ? 'online' : 'offline' });
      } catch(e) { results.push({ name: 'DeepSeek', status: 'offline' }); }
    } else { results.push({ name: 'DeepSeek', status: 'pending' }); }
    if (this.config.cellclawUrl) {
      try {
        const r = await fetch(this.config.cellclawUrl + '/status', { signal: AbortSignal.timeout(3000) });
        results.push({ name: 'CellClaw', status: r.ok ? 'online' : 'offline' });
      } catch(e) { results.push({ name: 'CellClaw', status: 'offline' }); }
    } else { results.push({ name: 'CellClaw', status: 'pending' }); }
    if (this.config.taskerUrl) {
      try {
        const r = await fetch(this.config.taskerUrl + '/status', { signal: AbortSignal.timeout(3000) });
        results.push({ name: 'Tasker', status: r.ok ? 'online' : 'offline' });
      } catch(e) { results.push({ name: 'Tasker', status: 'offline' }); }
    } else { results.push({ name: 'Tasker', status: 'pending' }); }
    results.push({ name: 'MCP', status: 'pending' });
    results.forEach(r => {
      const card = document.querySelector('.status-card[data-service="' + r.name.toLowerCase() + '"]');
      if (card) {
        const badge = card.querySelector('.card-status');
        badge.textContent = r.status === 'online' ? '已连接' : (r.status === 'offline' ? '离线' : '待配置');
        badge.className = 'card-status ' + r.status;
      }
    });
  },
  checkFirstRun() {
    if (!localStorage.getItem('hub_init')) {
      localStorage.setItem('hub_init', 'true');
      setTimeout(() => this.checkAllServices(), 500);
    } else { setTimeout(() => this.checkAllServices(), 300); }
  },
  saveConfig(key, value) {
    this.config[key] = value;
    localStorage.setItem(key, value);
  }
};
function toast(msg, duration) {
  if (!duration) duration = 2000;
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 300); }, duration);
}
document.addEventListener('DOMContentLoaded', () => App.init());
Object.assign(window, { App, toast });


