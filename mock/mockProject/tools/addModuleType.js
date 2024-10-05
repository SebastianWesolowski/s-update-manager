const fs = require('fs-extra');

const packageJsonPath = './dist/package/package.json';
const packageJson = fs.readJsonSync(packageJsonPath);
packageJson.type = 'module';
fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });

console.log('The "type" field has been added to the package.json file.');
