
require('dotenv').config()
const exec = require('child_process').exec;

const env = process.env.BUILD_ENV;

let command;
console.log("environment selected :", env)
switch (env) {
  case 'production':
    command = 'yarn build:ssr';
    break;
  case 'development':
    command = 'yarn build-dev:ssr';
    break;
  // case 'stage':
  //   command = 'npm run build:dev';
  //   break;
  default:
    command = 'yarn build:ssr'; // Default build command
}

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Execution error: ${error}`);
    return;
  }
  console.log(stdout);
  console.error(stderr);
});
