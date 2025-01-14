# Index of Workflow Documentation

This index provides quick access to detailed documentation for each workflow available in this repository. Each workflow serves a distinct purpose and can be reused in other workflows as needed. Click on the links to navigate to the specific documentation.

---

## Workflows

### 1. [Maven Publish Workflow](./reusable/maven-publish_doc.md)
   - **Description**: Automates the process of signing and deploying Maven artifacts to a repository (e.g., Maven Central). This workflow ensures consistent and secure publishing of artifacts.
   - **Key Features**:
     - Supports configurable Maven commands.
     - Uses GPG for artifact signing.
     - Caches Maven dependencies for faster builds.

### 2. [GitHub Release Workflow](./reusable/create-github-release_doc.md)
   - **Description**: Automates the creation of a GitHub release, including tagging the repository and publishing the release on GitHub. Useful for managing versioned releases.
   - **Key Features**:
     - Creates and pushes Git tags.
     - Generates GitHub releases using the `gh` CLI.
     - Supports draft and prerelease options.

### 3. [Update Version on pom.xml Workflow](./reusable/update-pom-release_doc.md)
   - **Description**: Updates the `<revision>` version in a specified `pom.xml` file and commits the changes back to the repository. Simplifies version management in Maven projects.
   - **Key Features**:
     - Edits `pom.xml` to update the `<revision>` tag.
     - Commits and pushes changes to the repository.
     - Ensures version consistency across releases.

---

## Usage

To use any of the workflows, refer to their respective documentation for detailed instructions on inputs, secrets, and example usage.

---

### Notes
- Ensure the necessary permissions and configurations (e.g., GitHub secrets, branch protection rules) are in place before using these workflows.
- Each workflow is designed to be modular and can be triggered via `workflow_call` for reuse.

For any further assistance or issues, feel free to reach out to the repository maintainers.
