# Pom update Action

**Category**: File Management

**Description**: This action updates an XML node's value in a specified file using an XPath expression.

## Inputs

| Name         | Required  | Description                                                                                     | Default                                   |
|--------------|-----------|-------------------------------------------------------------------------------------------------|-------------------------------------------|
| `filePath`   | No        | The path to the XML file to update.                                                             | `./pom.xml`                               |
| `path`       | No        | The XPath expression to locate the node to update.                                              | `//p:project/p:properties/p:revision`     |
| `newValue`   | Yes       | The new value to set for the selected XML node.                                                 | N/A                                       |

## Example Usage

```yaml
name: Update XML Node
on:
  workflow_dispatch:

jobs:
  update-xml:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v2

      - name: Update XML Node
        uses: uses: netcracker/qubership-workflow-hub/actions/pom-update@main
        with:
          filePath: './pom.xml'
          path: '//p:project/p:properties/p:revision'
          newValue: '1.0.1'
