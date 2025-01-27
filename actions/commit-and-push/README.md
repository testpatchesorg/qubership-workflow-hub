# Commit and Push Action

**Category**: Source Code Management

**Description**: This action performs a commit and pushes changes to the specified repository.

## Inputs

| Name            | Required  | Description                                              |
|-----------------|-----------|----------------------------------------------------------|
| `branch`        | No       | The branch to which the changes will be pushed.         |
| `commit_message`| No       | The commit message.                                     |
| `author_name`   | No        | The name of the commit author. Defaults Tech Qubersip. |
| `author_email`  | No        | The email of the commit author. Defaults tech@qubership.com. |

## Example Usage

```yaml
name: Commit and Push Changes
on:
  push:
    branches:
      - main

jobs:
  commit-and-push:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v2

      - name: Make Changes
        run: |
          # Commands to make changes
          echo "Some changes" >> file.txt

      - name: Commit and Push Changes
        uses: Netcracker/qubership-workflow-hub/actions/commit-and-push@main
        with:
          branch: 'main'
          commit_message: 'Added changes to file.txt'
          author_name: 'Your Name'
          author_email: 'your-email@example.com'
