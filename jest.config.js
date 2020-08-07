// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require("@inpyjamas/scripts/jest");
config.coverageThreshold = {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70,
  }
};
module.exports = config;
