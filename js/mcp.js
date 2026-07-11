// ===== MCP Module =====
const MCP = {
  ws: null,
  connections: JSON.parse(localStorage.getItem('mcp_connections') || '{}'),
  serverTemplates: {
    calendar: { name: '\u65e5\u5386', type: 'google', color: '#4285f4' },
    cloud: { name: '\u4e91\u76d8', type: 'onedrive', color: '#0078d4' },
    knowledge: { name: '\u77e5\u8bc6\u5e93', type: 'notion', color: '#000000' }
  },
  init() {
    document.querySelectorAll('.mcp-connect').forEach(btn => {
      btn.addEventListener('click', () => this.toggleConnection(btn.dataset.server));
    });
    document.querySelector('.add-mcp')?.addEventListener('click', () => this.addCustom());
    this.renderCustom();
    this.updateConnectionStatus();
  },
  toggleConnection(id) {
    if (this.connections[id]) {
      delete this.connections[id];
      localStorage.setItem('mcp_connections', JSON.stringify(this.connections));
      toast('\u5df2\u65ad\u5f00: ' + (this.serverTemplates[id]?.name || id));
    } else {
      const template = this.serverTemplates[id];
      if (template) {
        this.connections[id] = { ...template, connected: true, time: Date.now() };
        localStorage.setItem('mcp_connections', JSON.stringify(this.connections));
        toast('\u5df2\u8fde\u63a5: ' + template.name);
      }
    }
    this.updateConnectionStatus();
  },
  updateConnectionStatus() {
    document.querySelectorAll('.mcp-connect').forEach(btn => {
      const id = btn.dataset.server;
      if (this.connections[id]) {
        btn.textContent = '\u5df2\u8fde\u63a5';
        btn.classList.add('connected');
      } else {
        btn.textContent = '\u8fde\u63a5';
        btn.classList.remove('connected');
      }
    });
  },
  addCustom() {
    const container = document.getElementById('custom-mcps');
    const div = document.createElement('div');
    div.className = 'mcp-server';
    div.style.cssText = 'padding:12px;background:var(--bg2);border-radius:var(--radius-sm)';
    div.innerHTML = '<input type="text" class="config-input" placeholder="\u670d\u52a1\u540d\u79f0" style="margin-bottom:6px"><input type="url" class="config-input" placeholder="WebSocket URL (ws://...)" style="margin-bottom:6px"><div style="display:flex;gap:6px"><button class="btn" style="flex:1;background:var(--accent);color:#fff">\u8fde\u63a5</button><button class="btn" style="flex:0">\u5220\u9664</button></div>';
    const delBtn = div.querySelector('button:last-child');
    delBtn.addEventListener('click', () => div.remove());
    const connBtn = div.querySelector('button:first-child');
    connBtn.addEventListener('click', () => {
      const name = div.querySelector('input:first-child').value;
      const url = div.querySelector('input:nth-child(2)').value;
      if (!name || !url) { toast('\u8bf7\u586b\u5199\u5b8c\u6574\u4fe1\u606f'); return; }
      this.connections['custom_' + Date.now()] = { name, url, connected: true, time: Date.now() };
      localStorage.setItem('mcp_connections', JSON.stringify(this.connections));
      toast('\u5df2\u8fde\u63a5: ' + name);
      connBtn.textContent = '\u5df2\u8fde\u63a5';
      connBtn.style.background = 'var(--green)';
    });
    container.appendChild(div);
  },
  renderCustom() {
    const container = document.getElementById('custom-mcps');
    container.innerHTML = '';
    Object.entries(this.connections).forEach(([id, conn]) => {
      if (this.serverTemplates[id]) return;
      const div = document.createElement('div');
      div.className = 'mcp-server';
      div.style.cssText = 'padding:12px;background:var(--bg2);border-radius:var(--radius-sm)';
      div.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between"><span style="font-size:13px;font-weight:600">' + conn.name + '</span><span style="font-size:11px;color:var(--green)">\u5df2\u8fde\u63a5</span></div>';
      container.appendChild(div);
    });
  },
  connectWS() {
    const url = App.config.mcpHost;
    if (!url || !App.config.mcpReconnect) return;
    try {
      this.ws = new WebSocket(url);
      this.ws.onopen = () => { console.log('MCP WS connected'); Dashboard.updateStatus('mcp', 'online'); };
      this.ws.onclose = () => { console.log('MCP WS closed'); Dashboard.updateStatus('mcp', 'pending'); if (App.config.mcpReconnect) setTimeout(() => this.connectWS(), 5000); };
      this.ws.onerror = () => { Dashboard.updateStatus('mcp', 'offline'); };
      this.ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          console.log('MCP message:', data);
        } catch(e) {}
      };
    } catch(e) { console.error('MCP WS error:', e); }
  },
  sendMCP(method, params) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ jsonrpc: '2.0', method, params, id: Date.now() }));
    } else { toast('MCP \u672a\u8fde\u63a5'); }
  }
};
document.addEventListener('DOMContentLoaded', () => MCP.init());

