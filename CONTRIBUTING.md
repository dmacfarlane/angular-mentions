# Contributing

The aim of this library is to provide a high-quality and stable component that users can depend on.

Changes to the library need to be backwards compatible for existing users. This means no breaking changes or significant changes in functionality. PRs will not be merged if they break this rule.

Your PR is more likely to be merged if it contains a single, simple and clean fix or change. A bundle that contains several different or unrelated changes has more risk and is more difficult and time consuming to review, validate and test. With this in mind, refactoring, reformatting, and other personal style changes should not be included with functional changes.

If you would like to propose significant changes then it may be best to open an issue first to discuss them before starting work.

## Testing

Please ensure the e2e tests pass before creating a PR. The e2e tests should be updated as necessary to expand coverage and test new features.

## Versioning

Do not increment the package.json version number when creating a PR. This will be done as part of the process to release and publish the next version. The version numbers should comply with NPM semantic versioning for published packages to avoid introducing issues for existing users.
