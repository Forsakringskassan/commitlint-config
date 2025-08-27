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

## Git hooks

This package uses a postinstall script to automatically add Git hooks to your application.

- Prettier and Esbuild will run before commit is created (if packages exist in your application
- The commit message will be validated.

If you already have `husky`, `simple-git-hooks` or `lint-staged` in your `package.json` you need uninstall them first:

```bash
npm rm lint-staged husky simple-git-hooks
```
