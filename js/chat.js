// ===== DeepSeek Chat Module =====
const Chat = {
  history: [],
  isStreaming: false,
  init() {
    this.loadHistory();
    this.bindEvents();
  },
  bindEvents() {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('btn-send');
    const send = () => this.sendMessage();
    sendBtn.addEventListener('click', send);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
    });
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    });
  },
  loadHistory() {
    try { this.history = JSON.parse(localStorage.getItem('chat_history') || '[]').slice(-50); }
    catch(e) { this.history = []; }
  },
  saveHistory() {
    localStorage.setItem('chat_history', JSON.stringify(this.history.slice(-100)));
  },
  addMessage(role, content) {
    this.history.push({ role, content, time: Date.now() });
    this.saveHistory();
  },
  showTyping(container) {
    const div = document.createElement('div');
    div.className = 'message ai';
    div.id = 'typing-indicator';
    div.innerHTML = '<div class="avatar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></div><div class="bubble"><div class="typing"><span></span><span></span><span></span></div></div>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  },
  removeTyping() {
    const el = document.getElementById('typing-indicator');
    if (el) el.remove();
  },
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },
  renderMd(text) {
    return this.escapeHtml(text).replace(/\n/g, '<br>').replace(/\*\*(.+?)\*\*/g, '<strong></strong>').replace(/([^]+)/g, '<code style="background:var(--bg2);padding:1px 4px;border-radius:4px;font-size:12px"></code>');
  },
  renderMessage(role, content, container) {
    const div = document.createElement('div');
    div.className = 'message ' + role;
    const bubbleContent = role === 'ai' ? this.renderMd(content) : this.escapeHtml(content).replace(/\n/g, '<br>');
    div.innerHTML = '<div class="avatar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></div><div class="bubble"><p>' + bubbleContent + '</p></div>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return div;
  },
  async sendMessage() {
    if (this.isStreaming) return;
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;
    const key = App.config.deepseekKey;
    if (!key) { toast('请先在设置中配置 DeepSeek API Key'); document.querySelector('.nav-item[data-page="settings"]').click(); return; }
    input.value = '';
    input.style.height = 'auto';
    const container = document.getElementById('chat-messages');
    this.renderMessage('user', msg, container);
    this.addMessage('user', msg);
    this.showTyping(container);
    this.isStreaming = true;
    document.getElementById('btn-send').disabled = true;
    try {
      const messages = [
        { role: 'system', content: 'You are an AI agent assistant for a phone automation system called AI Agent Hub. The user is called \"\u8001\u5927\". You have access to CellClaw (phone automation), Tasker (Android automation), and MCP (Model Context Protocol) servers. Be helpful, concise, and proactive. Always respond in Chinese (Simplified).' },
        ...this.history.slice(-20).map(h => ({ role: h.role, content: h.content })),
        { role: 'user', content: msg }
      ];
      const url = App.config.deepseekUrl.replace(/\/+$/, '');
      const response = await fetch(url + '/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
        body: JSON.stringify({ model: App.config.deepseekModel, messages, stream: true, temperature: 0.7, max_tokens: 4096 })
      });
      if (!response.ok) { const err = await response.text(); throw new Error(err || 'API error'); }
      this.removeTyping();
      const aiDiv = document.createElement('div');
      aiDiv.className = 'message ai';
      aiDiv.innerHTML = '<div class="avatar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></div><div class="bubble"><p></p></div>';
      container.appendChild(aiDiv);
      const aiContentP = aiDiv.querySelector('.bubble p');
      let fullContent = '';
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() || '';
        for (const line of lines) {
          const t = line.trim();
          if (!t || !t.startsWith('data: ')) continue;
          const d = t.slice(6);
          if (d === '[DONE]') break;
          try {
            const p = JSON.parse(d);
            const delta = p.choices?.[0]?.delta?.content || '';
            if (delta) { fullContent += delta; aiContentP.innerHTML = this.renderMd(fullContent); container.scrollTop = container.scrollHeight; }
          } catch(e) {}
        }
      }
      if (buf.trim().startsWith('data: ')) {
        const d = buf.trim().slice(6);
        if (d !== '[DONE]') { try { const p = JSON.parse(d); const delta = p.choices?.[0]?.delta?.content || ''; if (delta) { fullContent += delta; aiContentP.innerHTML = this.renderMd(fullContent); } } catch(e) {} }
      }
      this.addMessage('assistant', fullContent);
    } catch(err) {
      this.removeTyping();
      const errDiv = document.createElement('div');
      errDiv.className = 'message ai';
      errDiv.innerHTML = '<div class="avatar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></div><div class="bubble"><p style="color:var(--red)">\u51fa\u9519\u4e86\uff1a' + this.escapeHtml(err.message) + '</p></div>';
      container.appendChild(errDiv);
      console.error('Chat error:', err);
    } finally {
      this.isStreaming = false;
      document.getElementById('btn-send').disabled = false;
      input.focus();
    }
  }
};
document.addEventListener('DOMContentLoaded', () => Chat.init());

