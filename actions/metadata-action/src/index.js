// With a motherfucking microphone, plug it in my soul
// I'm a renegade riot getting out of control
// I'm-a keeping it alive and continue to be
// Flying like an eagle to my destiny

const core = require("@actions/core");
const github = require("@actions/github");

const ConfigLoader = require("./loader");
const RefExtractor = require("./extractor");

function generateSnapshotVersionParts() {
  const now = new Date();
  const iso = now.toISOString(); // "2025-02-25T14:30:53.123Z"
  const date = iso.slice(0, 10).replace(/-/g, ""); // "20250225"
  const time = iso.slice(11, 19).replace(/:/g, ""); // "143053"
  return { date, time, timestamp: `${date}${time}` };
}

function extractSemverParts(versionString) {
  const normalized = versionString.replace(/^v/i, "");
  if (!/^\d+\.\d+\.\d+$/.test(normalized)) {
    core.warning(`Not a valid semver string (skip): ${versionString}`);
    return { major: "", minor: "", patch: "" };
  }
  const [major, minor, patch] = normalized.split(".");
  return { major, minor, patch };
}

function matchesPattern(refName, pattern) {
  const normalizedPattern = pattern.replace(/\//g, '-').replace(/\*/g, '.*');
  const regex = new RegExp('^' + normalizedPattern + '$');
  return regex.test(refName);
}

function findTemplate(refName, templates) {
  for (let item of templates) {
    let pattern = Object.keys(item)[0];
    if (matchesPattern(refName, pattern)) {
      return item[pattern]; // возвращаем значение из объекта item, а не templates
    }
  }
  return null;
}

function fillTemplate(template, values) {
  return template.replace(/{{\s*([\w-]+)\s*}}/g, (match, key) => {
    return key in values ? values[key] : match;
  });
}

async function run() {

  core.info(`pull_request head.ref: ${github.context.payload.pull_request?.head?.ref}`);
  core.info(`pull_request head: ${JSON.stringify(github.context.payload.pull_request?.head, null, 2)}`);
  let name = core.getInput('ref');

  if (!name) {
    name = github.context.eventName === 'pull_request' ? github.context.payload.pull_request?.head?.ref : github.context.ref;
  }

  core.info(`🔹 Ref Original: ${name}`);
  const ref = new RefExtractor().extract(name);

  core.info(`🔹 Ref: ${JSON.stringify(ref)}`);

  let defaultTemplate = core.getInput('default-template');
  let defaultDistributionTag = core.getInput('default-distribution-tag');

  let template;
  let distributionTag;

  if (!defaultTemplate || defaultTemplate.trim() === "") {
    const path = core.getInput('configuration-path') || "./.github/metadata-action-config.yml";
    const loader = new ConfigLoader();
    if (loader.fileExists()) {
      const config = loader.load(path);
      template = findTemplate(ref.name, config["branches-template"]);
      distributionTag = findTemplate(ref.name, config["distribution-tags"]);
    }
  }
  if (!template || template.trim() === "") {
    core.warning(`💡 No template found for ref: ${ref.name}, using default -> {{ref-name}}-{{timestamp}}-{{runNumber}}`);
    template = `{{ref-name}}-{{timestamp}}-{{runNumber}}`;
  }
  if (!distributionTag || distributionTag.trim() === "") {
    core.warning(`💡 No dist-tag found for ref: ${ref.name}, using default -> latest`);
    distributionTag = defaultDistributionTag || "latest";
  }
  
  const parts = generateSnapshotVersionParts();
  const semverParts = extractSemverParts(ref.name);
  const shortShaDeep = core.getInput("short-sha");
  const shortSha = github.context.sha.slice(0, shortShaDeep);
  const values = {
    ...ref, "ref-name": ref.name, "short-sha": shortSha, ...semverParts,
    ...parts, ...github.context, "dist-tag": distributionTag, "runNumber": github.context.runId
  };

  core.info(`🔹 time: ${JSON.stringify(parts)}`);
  core.info(`🔹 semver: ${JSON.stringify(semverParts)}`);
  core.info(`🔹 dist-tag: ${JSON.stringify(distributionTag)}`);

  // core.info(`Values: ${JSON.stringify(values)}`); //debug values
  let result = fillTemplate(template, values)

  core.info(`🔹 Template: ${template}`);

  core.info(`🔹 Name: ${ref.name}`)
  core.info(`💡 Rendered template: ${result}`);

  core.setOutput("result", result);
  core.setOutput("ref", ref);
  core.setOutput("ref-name", ref.name);
  core.setOutput("date", parts.date);
  core.setOutput("time", parts.time);
  core.setOutput("Timestamp", parts.timestamp);
  core.setOutput("major", semverParts.major);
  core.setOutput("minor", semverParts.minor);
  core.setOutput("patch", semverParts.patch);
  core.setOutput("tag", distributionTag);
  core.setOutput("short-sha", shortSha);

  core.info('✔️ Action completed successfully!');
}

run();
