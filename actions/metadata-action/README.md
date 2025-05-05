# 🚀 GitHub Metadata Action

This **GitHub Metadata** GitHub Action extracts metadata from the current GitHub context and generates a version string based on templates and tags.

---

## Features

- Extracts metadata from the current GitHub context.
- Generates a version string based on templates and tags.
- Supports custom templates and configuration files.
- Provides semantic version parsing for branches and tags.
- Dynamically determines distribution tags based on branch or tag patterns.

---

## 📌 Inputs

| Name                  | Description                                                                 | Required | Default                                |
| --------------------- | --------------------------------------------------------------------------- | -------- | -------------------------------------- |
| `ref`                 | Branch or tag ref. If not provided, it defaults to the current GitHub ref. | No       | `github.context.ref`                  |
| `configuration-path`  | Path to the configuration file.                                             | No       | `./.github/metadata-action-config.yml` |
| `default-template`    | Default template to use if no matching template is found in the config.     | No       | `{{ref-name}}-{{timestamp}}-{{runNumber}}` |
| `default-distribution-tag` | Default distribution tag to use if no matching tag is found in the config. | No       | `latest`                               |
| `short-sha`           | Length of the short SHA to include in the output.                          | No       | `7`                                    |

---

## 📌 Outputs

| Name        | Description                                                                                     | Example                     |
| ----------- | ----------------------------------------------------------------------------------------------- | --------------------------- |
| `result`    | Rendered template with metadata based on template rules.                                        | `v1.2.3-20250313`           |
| `ref`       | The full GitHub ref (e.g., `refs/heads/main`).                                                  | `refs/heads/main`           |
| `ref-name`  | The name of the current branch or tag.                                                          | `main`                      |
| `date`      | Current date in `YYYYMMDD` format.                                                              | `20250313`                  |
| `time`      | Current time in `HHMMSS` format.                                                                | `235959`                    |
| `timestamp` | Combined date and time in `YYYYMMDDHHMMSS` format.                                              | `20250313235959`            |
| `dist-tag`  | Distribution tag based on the branch or tag (e.g., `latest` for main, `beta` for feature branches). | `latest`                    |
| `major`     | Major version number extracted from semantic versioning.                                        | `1`                         |
| `minor`     | Minor version number extracted from semantic versioning.                                        | `2`                         |
| `patch`     | Patch version number extracted from semantic versioning.                                        | `3`                         |
| `short-sha` | Shortened commit SHA based on the specified length.                                             | `abc1234`                   |

---

## Usage Example

Below is an example of how to use this action in a GitHub Actions workflow:

```yaml
name: Extract Metadata

on:
  push:
    branches:
      - main

jobs:
  extract-metadata:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Extract Metadata
        uses: Netcracker/qubership-workflow-hub/actions/metadata-action@main
        with:
          configuration-path: './.github/metadata-action-config.yml'
          default-template: '{{ref-name}}-{{timestamp}}'
          default-distribution-tag: 'latest'
          short-sha: 8
```

---

## Configuration File

The configuration file (`metadata-action-config.yml`) defines templates and distribution tags for branches and tags. Below is an example configuration:

```yaml
branches-template:
  - main: "v{{major}}.{{minor}}.{{patch}}-{{date}}"
  - "feature/*": "feature-{{ref-name}}-{{timestamp}}.{{dist-tag}}"
  - "release/*": "release-{{ref-name}}-{{timestamp}}.{{dist-tag}}"
  - tag: "v{{major}}.{{minor}}.{{patch}}"

distribution-tags:
  - main: "latest"
  - "release/*": "next"
  - "feature/*": "beta"
  - tag: "stable"
```

### Explanation:

- **Main branch template:** generates a version string in the format `vMAJOR.MINOR.PATCH-DATE` (e.g. `v1.2.3-20250313`).
- **Feature branch template:** generates a version string in the format `feature-BRANCH_NAME-TIMESTAMP.DIST-TAG` (e.g. `feature-my-feature.20250313235959.beta`).
- **Release branch template:** generates a version string in the format `release-BRANCH_NAME-TIMESTAMP.DIST-TAG` (e.g. `release-v1.2.3-20250313235959.next`).
- **Tag template:** generates a version string in the format `vMAJOR.MINOR.PATCH` (e.g. `v1.2.3`).

---

## Additional Information

### GitHub Context Availability

The GitHub context is available, allowing you to access properties such as the current branch, tag, and other metadata. This context can be used within the action to dynamically generate version strings and tailor behavior based on the repository state.
More information [here](https://docs.github.com/ru/actions/writing-workflows/choosing-what-your-workflow-does/accessing-contextual-information-about-workflow-runs).

### Semantic Version Parsing Contract

The variables `major`, `minor`, and `patch` are parsed only from a branch or tag that follows the format `vMAJOR.MINOR.PATCH` (for example, `v1.0.1`). This format is a strict contract; only tags or branch names matching this pattern will be correctly parsed to extract the semantic version components.

### Configuration File Schema

The configuration file for this action must adhere to the schema defined [here](https://github.com/nookyo/qubership-workflow-hub/blob/main/actions/metadata-action/config.schema.json). This ensures that all templates, distribution tags, and other configuration options follow the required structure for correct parsing and execution.

```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Metadata configuration file schema",
    "type": "object",
    "properties": {
        "branches-template": {
            "type": "array",
            "minItems": 1,
            "items": {
                "type": "object",
                "minProperties": 1,
                "maxProperties": 1,
                "patternProperties": {
                    "^[-a-zA-Z0-9_*]+$": {
                        "type": "string"
                    }
                },
                "additionalProperties": false
            }
        },
        "distribution-tags": {
            "type": "array",
            "minItems": 1,
            "items": {
                "type": "object",
                "minProperties": 1,
                "maxProperties": 1,
                "patternProperties": {
                    "^[-a-zA-Z0-9_*]+$": {
                        "type": "string"
                    }
                },
                "additionalProperties": false
            }
        }
    },
    "required": [
        "branches-template"
    ],
    "additionalProperties": false
}
```