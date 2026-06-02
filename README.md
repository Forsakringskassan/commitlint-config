# @forsakringskassan/commitlint-config

Based on [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) with additional checks for JIRA.

> <type>[optional scope]: <subject> (<reference>)
>
> [optional body]
>
> [optional footer(s)]

1. `fix: ` fixes a bug and results in a `PATCH` release.
2. `feat: ` introduces a new feature and results in a `MINOR` release.
3. `BREAKING CHANGE: ` in the footer followed by a description results in a `MAJOR` release. The description is added to the changelog.
4. `types` other than `fix` and `feat` is allowed, see list at [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional#type-enum)
5. `(fixes XYZ-123)` or `(refs XYZ-123)` JIRA reference must be included after subject.

## Install

```bash
$ npm install --save-dev @forsakringskassan/commitlint-config
```

This package bundles `@commitlint/cli` so it does not have to be installed separately.

## Configuration

This package provides two variants:

- `@forsakringskassan/commitlint-config/default`
- `@forsakringskassan/commitlint-config/no-jira`

The default configuration enforces a JIRA reference at the end of the header.
The `no-jira` variant does not enforce it.

```bash
npm pkg set commitlint.extends=@forsakringskassan/commitlint-config/default
```

or manually edit `package.json`:

```json
{
    "commitlint": {
        "extends": "@forsakringskassan/commitlint-config/default"
    }
}
```

## Adding hooks

This package also provides the following git hooks:

- Prettier and Esbuild will run before a commit is created (if the packages exist in your application).
- The commit message will be validated.

To validate commit messages as commits are created, you also need to set up the Git hooks.

### Running setup manually (Recommended)

If you install with `--ignore-scripts`, the postinstall script will not run automatically.
You can trigger the setup manually by calling the `commitlint-config` command, for example from your own `prepare` script:

```json
{
    "scripts": {
        "prepare": "commitlint-config"
    }
}
```

### Postinstall script (Deprecated, will be removed in future releases)

Hooks will automatically be installed if you omit `--no-script` when installing an application with this package. However, this is not a recommended approach and this alternative will be removed.

## Before installing this plugin

If you already have `husky`, `simple-git-hooks` or `lint-staged` in your `package.json` you need uninstall them first:

```bash
npm rm lint-staged husky simple-git-hooks
```
