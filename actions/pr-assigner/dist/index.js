/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 27:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const fs = __nccwpck_require__(896);
const yaml = __nccwpck_require__(444);
const core = __nccwpck_require__(958);
const Ajv = __nccwpck_require__(326);
const path = __nccwpck_require__(928);

class ConfigLoader {
  constructor() {
  }

  load(filePath) {
    const configPath = path.resolve(filePath);
    console.log(`💡 Try to reading configuration ${configPath}`)

    if (!fs.existsSync(configPath)) {
      core.setFailed(`❗️ File not found: ${configPath}`);
      return;
    }

    const fileContent = fs.readFileSync(configPath, 'utf8');

    let config;
    try {
      config = yaml.load(fileContent);
    }
    catch (error) {
      core.setFailed(`❗️ Error parsing YAML file: ${error.message}`);
      return;
    }

    const schemaPath = __nccwpck_require__.ab + "config.schema.json";
    if (!fs.existsSync(__nccwpck_require__.ab + "config.schema.json")) {
      core.setFailed(`❗️ Schema file not found: ${schemaPath}`);
      return;
    }

    const schemaContent = fs.readFileSync(__nccwpck_require__.ab + "config.schema.json", 'utf8');

    let schema;
    try {
      schema = JSON.parse(schemaContent);
    }
    catch (error) {
      core.setFailed(`❗️ Error parsing JSON schema: ${error.message}`);
      return;
    }

    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(config);
    if (!valid) {
      let errors = ajv.errorsText(validate.errors);
      core.setFailed(`❗️ Configuration file is invalid: ${errors}`);
      return;
    }
    core.warning(`Configuration file is valid: ${valid}`);
    return config;
  }
}

module.exports = ConfigLoader;

/***/ }),

/***/ 958:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 394:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 326:
/***/ ((module) => {

module.exports = eval("require")("ajv");


/***/ }),

/***/ 444:
/***/ ((module) => {

module.exports = eval("require")("js-yaml");


/***/ }),

/***/ 317:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ 896:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 928:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
const core = __nccwpck_require__(958);
const github = __nccwpck_require__(394);
const fs = __nccwpck_require__(896);
const path = __nccwpck_require__(928);
const ConfigLoader = __nccwpck_require__(27);
const { execSync } = __nccwpck_require__(317);

function findFile(filename, startDir = process.cwd()) {
    let dir = startDir;
    while (dir !== path.parse(dir).root) {
        const filePath = path.join(dir, filename);
        if (fs.existsSync(filePath)) {
            return filePath;
        }
        dir = path.dirname(dir);
    }
    return null;
}

function getUsersFromCodeowners(codeownersPath) {
    if (!codeownersPath) {
        core.setFailed(`❗️ Can't find CODEOWNERS file.`)
        return;
    }
    core.info(`🔍 CODEOWNERS file found on: ${codeownersPath}`);
    const codeownersContent = fs.readFileSync(codeownersPath, 'utf8');
    const lines = codeownersContent.split('\n');
    const userLine = lines.find(line => line.trim().startsWith('*'));
    return userLine.split(/\s+/).slice(1).filter(user => user.trim() !== '').map(user => user.replace('@', ''));
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


async function run() {
    const defaultConfigurationPath = ".github/pr-assigner-config.yml";
    const configurationPath = core.getInput("configuration-path") || defaultConfigurationPath;

    let count = core.getInput("assignees-count") || 1;

    let assignees = [];

    if (fs.existsSync(configurationPath)) {
        const content = new ConfigLoader().load(configurationPath);
        assignees = content['assignees'];
        count = content['count'] != null ? content['count'] : count;

        core.info(`🔹 Count for suffle: ${count}`);
        core.info(`🔹 Assignees: ${assignees}`);

        core.warning(`Use configuration file ${configurationPath}`)
    }
    else {
        const codeownersPath = findFile('CODEOWNERS');
        assignees = getUsersFromCodeowners(codeownersPath);
        if (assignees == null) {
            core.setFailed(`❗️ Can't process CODEOWNERS file`);
            return;
        }
        core.info(`🔹 Count for suffle: ${count}`);
        core.info(`🔹 Assignees: ${assignees}`);
        core.warning(`Use CODEOWNERS file`)
    }

    const assigneesLength = assignees.length;
    if (count > assigneesLength) {
        core.warning(`Assigners count ${count} more than array length ${assignees.length}. Will be use {array.length: ${assignees.length}}. Nice try 😉.`)
        count = assigneesLength;
    }

    if (assigneesLength > 1) {
        assignees = shuffleArray(assignees);
    }

    assignees = assignees.slice(0, count);

    try {
        const pullRequest = github.context.payload.pull_request;
        if (!pullRequest) {
            core.setFailed("❗️ Action have to run on pull request.");
            process.exit(1);
        }

        const cmd = `gh pr edit ${pullRequest.number} --add-assignee ${assignees}`

        execSync(cmd, { stdio: 'inherit' });

        core.info("✅ Action completed successfully!");

    } catch (error) {
        core.setFailed(`❗️ ${error.message}`);
    }
}

run();
module.exports = __webpack_exports__;
/******/ })()
;