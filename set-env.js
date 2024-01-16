// const fs = require('fs');
const  fs = require('fs');



// Path to your environment.prod.ts
let path = 'src/environments/environment.ts';
console.log("environment: ", process.env.production)
if(process.env.production === true){
  path = 'src/environments/environment.prod.ts';
}
const envFilePath = path.join(__dirname, path);
let envFileContent = fs.readFileSync(envFilePath, 'utf8');

// Regular expression to match process.env.VARIABLE_NAME patterns
const regex = /process.env.([a-zA-Z0-9_]+)\s*\?\?\s*'([^']+)'/g;

// Function to replace each found environment variable placeholder
envFileContent = envFileContent.replace(regex, (match, variableName, defaultValue) => {
  const envValue = process.env[variableName];
  return `'${envValue || defaultValue}'`;
});

// Write the modified content back to the file
fs.writeFileSync(envFilePath, envFileContent);
console.log("envFileContent", envFileContent);
console.log('Environment file updated.');
