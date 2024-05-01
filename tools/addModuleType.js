const fs = require('fs-extra');

const packageJsonPath = './dist/package/package.json';
const packageJson = fs.readJsonSync(packageJsonPath);
packageJson.type = 'module';
fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });

console.log('Pole "type" zostało dodane do pliku package.json.');
