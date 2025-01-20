# qubership-workflow-hub

The repository for reusable workflows.

Detailed description of existing workflows can be found here [Index of Workflow Documentation](./docs/README.md)

---

Below is the short description of how to implement common workflows in any Netcracker repository. All necessery secrets and variables for common workflows are already present on organization level, no additional settings or configurations are required. 

<span id="1"></span>**The organization level secrets and vars used in actions**

| Name                          | Purpose                                                                              |
|-------------------------------|--------------------------------------------------------------------------------------|
| secrets.PERSONAL_ACCESS_TOKEN | Used by actions to access repositories data                                          |
| secrets.MAVEN_USER            | User name to authenticate in Maven Central repository to publish released artifacts  |
| secrets.MAVEN_PASSWORD        | User token to authenticate in Maven Central repository to publish released artifacts |
| secrets.MAVEN_GPG_PRIVATE_KEY | GPG private key to sign artefacts (jar, pom etc) to publish them into Maven Central  |
| secrets.MAVEN_GPG_PASSPHRASE  | GPG private key passphrase                                                           |

## Common workflows

There are several reusable workflows which should be added into every Netcracker repository, see the description below.

### CLA

The action for [CLA](./CLA/cla.md) "signing" for contributors.

> More info about underlying GitHub action can be found here [contributor-assistant](https://github.com/contributor-assistant/github-action)

To add the CLA signing into your repository just create the new file `.github/workflows/cla.yaml` and paste the code below or just copy the [prepared file](./docs/examples/cla.yaml):

```yaml
---
name: CLA Assistant
on:
  issue_comment:
    types: [created]
  pull_request_target:
    types: [opened,closed,synchronize]
jobs:
  cla_assistant:
    uses: Netcracker/qubership-workflow-hub/.github/workflows/cla.yaml@main
    secrets:
      personal_access_token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
```

The `PERSONAL_ACCESS_TOKEN` is defined on organization level then you can use it in any Netcracker/* repository.

### Prettier

The action to check style and syntax of several document types. It creates PR if found any issue.

> More info about underlying GitHub action can be found here [prettier-fix](https://github.com/WorkOfStan/prettier-fix)

To add the prettier into your repository just create the new file `.github/workflows/prettier.yaml` and paste the code belowor just copy the [prepared file](./docs/examples/prettier.yaml):

```yaml
---
name: Prettier-fix
on: [pull_request, push, workflow_dispatch]

permissions:
  contents: write

jobs:
  call-prettier-fix:
    uses: Netcracker/qubership-workflow-hub/.github/workflows/prettierFix.yaml@main
```

### Profanity filter

The action to check PRs/issues comments on profany words.

> More info about underlying GitHub action can be found here [profanity-filter](https://github.com/IEvangelist/profanity-filter)

To add the profanity filter into your repository just create the new file `.github/workflows/profanity-filter.yaml` and paste the code below or just copy the [prepared file](./docs/examples/profanity-filter.yaml):

```yaml
---
name: Profanity filter

on:
  issue_comment:
    types: [created, edited]
  issues:
    types: [opened, edited, reopened]
  pull_request:
    types: [opened, edited, reopened]

permissions:
  issues: write
  pull-requests: write

jobs:
  call-apply-filter:
    uses: Netcracker/qubership-workflow-hub/.github/workflows/profanityFilter.yaml@main
```

---

## Maven project release workflow

Maven project release workflow is used to make a Github release and publish released artifacts into Maven Central.
The workflow consists of several sequential jobs:

1. [Update pom.xml file with the release version](./docs/reusable/update-pom-release_doc.md).
2. [Create GitHub release](./docs/reusable/create-github-release_doc.md)
3. [Publish released artifacts into Maven Central](./docs/reusable/maven-publish_doc.md)
---

To make it use one need to do several preparations in the project.

### Step 1: Prepare pom.xml

First of all please make sure the `pom.xml` file prepared to build source code and java doc jars alongside with main artifact. You need to sign all publishing artifacts with PGP key too. The instruction on how to do it can be found here [Prepare your project to publish into Maven Central](./docs/maven-publish-pom-preparation_doc.md)

### Step 2: GitHub release workflow

Create a new workflow in your repository. Create a file `.github/workflows/github-release.yaml` and copy the code below or just copy the [prepared file](./docs/examples/github-release.yaml):

```yaml
---
name: GitHub Release

on:
  workflow_dispatch:
    inputs:
      version:
        required: true
        default: '2025.1-1.0.0'
        type: string
        description: 'Custom release version'
      publish:
        required: true
        type: boolean
        default: false
        description: 'Enable publish release?'

jobs:
  update-pom-version:
    uses:  Netcracker/qubership-workflow-hub/.github/workflows/update-pom-release.yml@main
    with:
      file: 'pom.xml'
      revision: ${{ github.event.inputs.version }}
  release:
    needs: [update-pom-version]
    uses:  Netcracker/qubership-workflow-hub/.github/workflows/release-drafter.yml@main
    with:
      version: ${{ github.event.inputs.version }}
      publish: ${{ github.event.inputs.publish }}
```

This workflow is designed to be run manually. It has two input parameters on manual execution:

- `Release version` -- a string represents version number of the release
- `Enable publish release?` -- boolean value. If `false` (default) the workflow will create a draft release. If it is `true` then workflow will create and publish a GitHub release.

### Step 3: Maven Central publication workflow

Create a new workflow in your repository. Create a file `.github/workflows/upload-to-maven-central.yaml` and copy the code below or just copy the [prepared file](./docs/examples/upload-to-maven-central.yaml):

```yaml
---
name: Upload Release to Maven Central

on:
  release:
    types:
      - released
  repository_dispatch:
    types:
      - maven-publication-trigger

jobs:
  get_release_version:
    runs-on: ubuntu-latest
    outputs:
      release_version: ${{ steps.get_release_version.outputs.release_version }}
    steps:
      - name: Get release version
        id: get_release_version
        run: |
          TAG_NAME=${{ github.event.release.tag_name }}
          RELEASE_VERSION=${TAG_NAME#v}
          echo ${RELEASE_VERSION}
          echo "release_version=${RELEASE_VERSION}" >> $GITHUB_OUTPUT

  upload_to_maven_central:
    uses: Netcracker/qubership-workflow-hub/.github/workflows/maven-publish.yml@main
    needs: [get_release_version]
    with:
      maven_command: "--batch-mode deploy"
      java_version: '21'
      revision: ${{ needs.get_release_version.outputs.release_version }}
    secrets:
      maven_username: ${{ secrets.MAVEN_USER }}
      maven_password: ${{ secrets.MAVEN_PASSWORD }}
      maven_gpg_passphrase: ${{ secrets.MAVEN_GPG_PASSPHRASE }}
      maven_gpg_private_key: ${{ secrets.MAVEN_GPG_PRIVATE_KEY }}
```

This workflow will set the release wersion in `pom.xml` file, create artifacts and publish them into Maven Central.

### Step 4: Add configuration file for GitHub release

Upload [prepared configuration file](./docs/examples/release-drafter.yml) to your repository in `.github/` folder. You can customize it in future for your needs.

### Step 5: Prepare actions secrets

The workflow needs several secrets to be prepared to work properly. For `Netcracker` repositories all of them already prepared, configured and available for use. You can find them in table [The organization level secrets and vars used in actions](#1). Detailed instructions on how to generate a GPG key and set up secrets in a GitHub repository can be found in [this document](./docs/maven-publish-secrets_doc.md).
