/**
 * 数据加载器 - 演示数据与结构分离的方案
 * 这个文件展示了如何将大量数据存储在JSON文件中，按需加载
 */

const DataLoader = {
  cache: {},

  async loadData(panelName) {
    if (this.cache[panelName]) {
      return this.cache[panelName];
    }

    try {
      const response = await fetch(`data/${panelName}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${panelName}.json`);
      }
      const data = await response.json();
      this.cache[panelName] = data;
      return data;
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  },

  renderRetentionTable(containerId, tableConfig) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = `
      <div class="card-block block-full" style="margin-top: 12px;">
        <div class="card-block-header">
          <div>
            <div class="card-block-title">${tableConfig.title}</div>
            <div class="card-block-sub">${tableConfig.subtitle}</div>
          </div>
        </div>
        <div class="table-placeholder" style="overflow-x: auto;">
          <div class="table-header-row" style="${tableConfig.gridStyle}">
    `;

    tableConfig.headers.forEach(header => {
      html += `<span>${header}</span>`;
    });

    html += `
          </div>
    `;

    tableConfig.data.forEach(row => {
      html += `
          <div class="table-data-row" style="${tableConfig.gridStyle}">
            <span>${row.date}</span><span>${row.newCount}</span>
      `;
      row.rates.forEach(rate => {
        html += `<span>${rate}</span>`;
      });
      html += `
          </div>
      `;
    });

    html += `
          <div class="table-footnote">
            在数数中通过：日期 + 服务器 + 终端 等维度，组合相应留存指标生成此表。
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  async initPanel(panelName) {
    const data = await this.loadData(panelName);
    if (!data) return;

    if (panelName === 'retention') {
      if (data.retention && data.retention.account) {
        this.renderRetentionTable('retention-account-table', data.retention.account);
      }
    }
  }
};

window.DataLoader = DataLoader;
