# Maven Release Action

This GitHub Action automates the process of building and releasing a Maven artifact. It supports version bumping (major, minor, patch), GPG signing, and optional dependency version bumping after release.

## Inputs

### `version-type`

**Required**  
Type of version bump for the release. Can be one of: `major`, `minor`, `patch`.  
_Default: `patch`_

### `module`

**Required**  
The module (repository name) to build.

### `ref`

**Optional**  
Branch name to create the release from.  
_Default: `main`_

### `maven-args`

**Optional**  
Additional Maven arguments to pass.  
_Default: `-DskipTests=true -Dmaven.javadoc.skip=true -B`_

### `server-id`

**Optional**  
Maven server ID.  
_Default: `github`_

### `java-version`

**Optional**  
Java version to use.  
_Default: `21`_

### `maven-version`

**Optional**  
Maven version to use.

### `dry-run`

**Optional**  
If set to `true`, performs a dry run without pushing changes.  
_Default: `true`_

### `token`

**Required**  
GitHub token for authentication.

### `gpg-private-key`

**Required**  
GPG private key for signing artifacts.

### `gpg-passphrase`

**Required**  
Passphrase for the GPG private key.

### `profile`

**Optional**  
Maven profile to use.

### `maven-user`

**Optional**  
Username to login to Maven central or GitHub packages.

### `maven-password`

**Optional**  
Password to login to Maven central or GitHub packages.

### `bump-dependencies-after-release`

**Optional**  
If set to `true`, bumps dependencies versions to the next snapshot after release.  
_Default: `false`_

## Outputs

### `release-version`

The version that was released.

## Example Usage

```yaml
name: Maven Release

on:
  workflow_dispatch:

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Release Maven Artifact
        uses: netcracker/qubership-workflow-hub/actions/maven-release@main
        with:
          version-type: 'minor'
          module: 'my-module'
          ref: 'main'
          token: ${{ secrets.GITHUB_TOKEN }}
          gpg-private-key: ${{ secrets.GPG_PRIVATE_KEY }}
          gpg-passphrase: ${{ secrets.GPG_PASSPHRASE }}
          maven-user: ${{ secrets.MAVEN_USER }}
          maven-password: ${{ secrets.MAVEN_PASSWORD }}
          bump-dependencies-after-release: 'true'
```

## How It Works

1. **Input Validation**: Checks required inputs and validates version type and module.
2. **Setup**: Configures Java and Maven environments.
3. **Checkout**: Clones the specified module and branch.
4. **Release**: Bumps the version, builds, and releases the artifact. Optionally bumps dependencies to the next snapshot version.
5. **Cleanup**: Cleans up workspace if dependency bumping is enabled.

## Notes

- Ensure all required secrets are available in your repository.
- The action supports both dry-run and actual release modes.
