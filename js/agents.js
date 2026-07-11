// ===== Agents Module (CellClaw & Tasker) =====
const Agents = {
  init() {
    document.querySelectorAll('.agent-card .head').forEach(h => {
      h.addEventListener('click', () => {
        const config = h.nextElementSibling;
        if (config) config.style.display = config.style.display === 'none' ? 'flex' : 'none';
      });
      h.nextElementSibling.style.display = 'none';
    });
    document.getElementById('cellclaw-toggle').addEventListener('change', (e) => {
      App.saveConfig('cellclaw_enabled', e.target.checked ? '1' : '0');
    });
    document.getElementById('tasker-toggle').addEventListener('change', (e) => {
      App.saveConfig('tasker_enabled', e.target.checked ? '1' : '0');
    });
    document.getElementById('cellclaw-url').addEventListener('change', (e) => App.saveConfig('cellclaw_url', e.target.value));
    document.getElementById('cellclaw-key').addEventListener('change', (e) => App.saveConfig('cellclaw_key', e.target.value));
    document.getElementById('tasker-url').addEventListener('change', (e) => App.saveConfig('tasker_url', e.target.value));
    document.querySelector('.btn-primary[data-agent="cellclaw"]').addEventListener('click', () => this.testCellClaw());
    document.getElementById('cellclaw-commands').addEventListener('change', (e) => {
      if (e.target.value) this.sendCellClawCommand(e.target.value);
      e.target.value = '';
    });
    document.querySelector('.add-workflow')?.addEventListener('click', () => this.addWorkflow());
    document.querySelector('.btn-full')?.addEventListener('click', () => this.saveWorkflows());
    this.loadConfig();
  },
  loadConfig() {
    document.getElementById('cellclaw-url').value = App.config.cellclawUrl || '';
    document.getElementById('cellclaw-key').value = App.config.cellclawKey || '';
    document.getElementById('tasker-url').value = App.config.taskerUrl || '';
    document.getElementById('cellclaw-toggle').checked = localStorage.getItem('cellclaw_enabled') === '1';
    document.getElementById('tasker-toggle').checked = localStorage.getItem('tasker_enabled') === '1';
  },
  async testCellClaw() {
    const url = App.config.cellclawUrl;
    if (!url) { toast('请先配置 CellClaw 地址'); return; }
    try {
      const r = await fetch(url + '/status', { signal: AbortSignal.timeout(3000) });
      if (r.ok) { toast('CellClaw \u8fde\u63a5\u6210\u529f'); Dashboard.updateStatus('cellclaw', 'online'); }
      else { toast('CellClaw \u8fde\u63a5\u5931\u8d25'); Dashboard.updateStatus('cellclaw', 'offline'); }
    } catch(e) { toast('CellClaw \u8fde\u63a5\u5931\u8d25\uff1a' + e.message); Dashboard.updateStatus('cellclaw', 'offline'); }
  },
  async sendCellClawCommand(cmd) {
    const url = App.config.cellclawUrl;
    if (!url) { toast('\u8bf7\u5148\u914d\u7f6e CellClaw'); return; }
    try {
      const r = await fetch(url + '/api/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd })
      });
      if (r.ok) toast('\u547d\u4ee4\u5df2\u53d1\u9001: ' + cmd);
      else toast('\u547d\u4ee4\u53d1\u9001\u5931\u8d25');
    } catch(e) { toast('\u547d\u4ee4\u53d1\u9001\u5931\u8d25\uff1a' + e.message); }
  },
  addWorkflow() {
    const list = document.getElementById('tasker-workflows');
    const item = document.createElement('div');
    item.className = 'workflow-item';
    item.innerHTML = '<select class="tasker-action"><option value="">\u9009\u62e9\u89e6\u53d1\u4e8b\u4ef6...</option><option value="time">\u5b9a\u65f6\u89e6\u53d1</option><option value="notification">\u901a\u77e5\u76d1\u542c</option><option value="app">\u5e94\u7528\u542f\u52a8</option><option value="battery">\u7535\u91cf\u53d8\u5316</option></select><select class="tasker-action"><option value="">\u9009\u62e9\u52a8\u4f5c...</option><option value="cellclaw">\u8c03\u7528 CellClaw</option><option value="notify">\u53d1\u9001\u901a\u77e5</option><option value="http">HTTP \u8bf7\u6c42</option><option value="mcp">MCP \u67e5\u8be2</option></select><button class="btn icon-only" onclick="this.parentElement.remove()">\u00d7</button>';
    list.appendChild(item);
  },
  saveWorkflows() {
    const items = document.querySelectorAll('.workflow-item');
    const workflows = [];
    items.forEach(item => {
      const selects = item.querySelectorAll('select');
      if (selects[0]?.value && selects[1]?.value) {
        workflows.push({ trigger: selects[0].value, action: selects[1].value });
      }
    });
    localStorage.setItem('tasker_workflows', JSON.stringify(workflows));
    toast('\u5de5\u4f5c\u6d41\u5df2\u4fdd\u5b58 (' + workflows.length + ' \u6761)');
  }
};
document.addEventListener('DOMContentLoaded', () => Agents.init());

