// ===== Settings Module =====
const Settings = {
  init() {
    this.loadSettings();
    this.bindEvents();
  },
  loadSettings() {
    document.getElementById('setting-deepseek-key').value = App.config.deepseekKey || '';
    document.getElementById('setting-deepseek-url').value = App.config.deepseekUrl || 'https://api.deepseek.com';
    document.getElementById('setting-deepseek-model').value = App.config.deepseekModel || 'deepseek-chat';
    document.getElementById('setting-mcp-host').value = App.config.mcpHost || 'ws://localhost:8080/mcp';
    document.getElementById('setting-mcp-reconnect').checked = App.config.mcpReconnect;
    document.getElementById('setting-theme').value = App.config.theme || 'dark';
  },
  bindEvents() {
    document.getElementById('setting-deepseek-key').addEventListener('change', (e) => {
      App.saveConfig('deepseek_key', e.target.value);
    });
    document.getElementById('setting-deepseek-url').addEventListener('change', (e) => {
      App.saveConfig('deepseek_url', e.target.value);
    });
    document.getElementById('setting-deepseek-model').addEventListener('change', (e) => {
      App.saveConfig('deepseek_model', e.target.value);
    });
    document.getElementById('setting-mcp-host').addEventListener('change', (e) => {
      App.saveConfig('mcp_host', e.target.value);
    });
    document.getElementById('setting-mcp-reconnect').addEventListener('change', (e) => {
      App.saveConfig('mcp_reconnect', e.target.checked ? 'true' : 'false');
    });
    document.getElementById('setting-theme').addEventListener('change', (e) => {
      App.saveConfig('theme', e.target.value);
      App.applyTheme();
    });
  }
};
document.addEventListener('DOMContentLoaded', () => Settings.init());

