# qubership-workflow-hub

The repository for reusable workflows.

## Common workflows

There are several reusable workflows which should be added into every Netcracker repository, see the description below.

### CLA

The action for [CLA](https://github.com/Netcracker/qubership-workflow-hub/blob/main/CLA/cla.md) "signing" for contributors.

> More info about underlying GitHub action can be found here [contributor-assistant](https://github.com/contributor-assistant/github-action)

To add the CLA signing into your repository just create the new file `.github/workflows/cla.yaml` and paste the code below:

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

To add the prettier into your repository just create the new file `.github/workflows/prettier.yaml` and paste the code below:

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

To add the profanity filter into your repository just create the new file `.github/workflows/profanity-filter.yaml` and paste the code below:

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
