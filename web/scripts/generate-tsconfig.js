// scripts/generate-tsconfig.js
require('dotenv').config(); // 加载 .env 文件
const fs = require('fs');
const path = require('path');

// 1. 获取所有应用目录
const appsDir = path.join(__dirname, '../src/app');
const allApps = fs.readdirSync(appsDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

// 2. 从 .env 读取需激活的应用
const activeApps = process.env.NEXTAPI_INSTALL_APP?.split(',') || ['app1'];
const excludedApps = allApps.filter(app => !activeApps.includes(app));

// 3. 生成仅包含排除规则的 tsconfig
fs.writeFileSync(
  'tsconfig.lint.json',
  JSON.stringify({
    extends: './tsconfig.json',
    exclude: [
      ...excludedApps.map(app => `src/app/${app}/**/*`),
      'node_modules'
    ]
  }, null, 2)
);

console.log('✅ 启用的应用:', activeApps.join(', '));
console.log('✅ 排除的应用:', excludedApps.length ? excludedApps.join(', ') : '无');
