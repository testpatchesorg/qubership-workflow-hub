# Reusable Workflow

This index provides a quick overview of the available workflow documentation in this repository. Each workflow serves a distinct purpose and is reusable via `workflow_call`. Use the table below to navigate to the specific documentation.

---

## Table of Contents
- [Reusable Workflows](#reusable-workflows)
- [Usage](#usage)
- [Examples](#examples)

---

## Flows

| Workflow Name                  | Description                                                                 | Documentation Link                                   |
|--------------------------------|-----------------------------------------------------------------------------|-----------------------------------------------------|
| Maven Publish         | Automates signing and deploying Maven artifacts to a repository.            | [Maven Publish](./reusable/maven-publish_doc.md)   |
| GitHub Release        | Automates creating and tagging releases on GitHub.                          | [GitHub Release](./reusable/create-github-release_doc.md) |
| Python Build          | Automates building, testing, and publishing Python packages.                | [Python Build](./reusable/python-publish.md)        |


---

## Usage

Refer to the respective documentation for detailed instructions on inputs, secrets, and example usage. For any questions or issues, feel free to contact the repository maintainers.

---

## Examples

### Maven Publish
```yaml
uses: ./.github/workflows/maven-publish.yml
with:
  # inputs
```
### GitHub Release
```yaml
uses: ./.github/workflows/github-release.yml
with:
  # inputs
```


### Python Build 
```yaml
uses: ./.github/workflows/python-build.yml
with:
  # inputs
```
