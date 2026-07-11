// ===== Dashboard Module =====
const Dashboard = {
  pageMap: { deepseek: 'settings', cellclaw: 'agents', tasker: 'agents', mcp: 'mcp' },
  statusText: { online: '\u5df2\u8fde\u63a5', offline: '\u79bb\u7ebf', pending: '\u5f85\u914d\u7f6e', error: '\u9519\u8bef' },
  init() {
    document.querySelectorAll('.status-card').forEach(card => {
      card.addEventListener('click', () => {
        const page = this.pageMap[card.dataset.service] || 'settings';
        const ni = document.querySelector('.nav-item[data-page="' + page + '"]');
        if (ni) ni.click();
      });
    });
  },
  updateStatus(id, status) {
    const card = document.querySelector('.status-card[data-service="' + id + '"]');
    if (!card) return;
    const badge = card.querySelector('.card-status');
    badge.textContent = this.statusText[status] || status;
    badge.className = 'card-status ' + status;
  }
};
document.addEventListener('DOMContentLoaded', () => Dashboard.init());

