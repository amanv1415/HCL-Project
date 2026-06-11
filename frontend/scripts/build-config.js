const fs = require('fs');
const path = require('path');

const apiUrl = process.env.API_URL || 'http://localhost:5000';
const output = `window.APP_CONFIG = {\n  API_BASE: '${apiUrl.replace(/'/g, "\\'")}',\n};\n`;

fs.writeFileSync(path.join(__dirname, '..', 'js', 'config.js'), output);
console.log(`Generated config.js with API_BASE=${apiUrl}`);
