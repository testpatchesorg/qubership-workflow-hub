# Update XML Node Action

**Category**: File Management

**Description**: This action updates an XML node's value in a specified XML file using an XPath expression.

## Inputs

| Name            | Required  | Description                                                                 |
|-----------------|-----------|-----------------------------------------------------------------------------|
| `filePath`      | No        | The path to the XML file to update. Defaults to `pom.xml`.                 |
| `path`          | No        | The XPath expression to locate the node to update. Defaults to `//p:project/p:properties/p:revision`. |
| `newValue`      | Yes       | The new value to set for the selected XML node.                            |

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
        uses: your-repo/your-action@main
        with:
          filePath: 'pom.xml'
          path: '//p:project/p:properties/p:revision'
          newValue: '1.0.1'
