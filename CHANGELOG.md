# CHANGELOG

## [3.0.3](https://github.com/Forsakringskassan/commitlint-config/compare/v3.0.2...v3.0.3) (2025-08-20)

### Bug Fixes

* prevent crashes when unsetting non-existent Git parameters (refs SB-4982) ([bfde2fb](https://github.com/Forsakringskassan/commitlint-config/commit/bfde2fb4127761d0a03c55bbd91ccca269d8d91b))

## [3.0.2](https://github.com/Forsakringskassan/commitlint-config/compare/v3.0.1...v3.0.2) (2025-08-19)

### Bug Fixes

* reset husky config if previous installed in package (refs SB-4982) ([5ad59ee](https://github.com/Forsakringskassan/commitlint-config/commit/5ad59eee268ed492207d5b128e6c1b2aa2d6b766))
* update broken config file (refs SB-4982) ([4ccf994](https://github.com/Forsakringskassan/commitlint-config/commit/4ccf99440e5fa463171304e78e31759e6f92b41f))

## [3.0.1](https://github.com/Forsakringskassan/commitlint-config/compare/v3.0.0...v3.0.1) (2025-08-19)

### Bug Fixes

* do no crash if package do not contain any dependencies (refs SB-4982) ([1b04af5](https://github.com/Forsakringskassan/commitlint-config/commit/1b04af515dc5d20441696bf7799ebfcef228ac79))
* validate package regardless if ci or not (refs SB-4982) ([212fc46](https://github.com/Forsakringskassan/commitlint-config/commit/212fc46b9daf7a06166d273cc863674fcb7263e0))

## [3.0.0](https://github.com/Forsakringskassan/commitlint-config/compare/v2.0.5...v3.0.0) (2025-08-19)

### ⚠ BREAKING CHANGES

* NodeJS v22.12.0 or later is now required.
* If you already have lint-staged, husky or simple-git-hooks installed,
these packaged needs to be removed.

npm uninstall lint-staged husky simple-git-hooks

### Features

* bundle git hooks (refs SB-4982) ([7ac2af7](https://github.com/Forsakringskassan/commitlint-config/commit/7ac2af78d734b6c4cdf89db1aca71c45f85ab0bd))
* possible to opt-out git hooks (refs SB-4982) ([1d45a83](https://github.com/Forsakringskassan/commitlint-config/commit/1d45a833e15ce8ebf55e44c242df8b3ff3cf4796))
* validate install (refs SB-4982) ([9bef7a8](https://github.com/Forsakringskassan/commitlint-config/commit/9bef7a823d2c3962498fd17bf16e5218e506d3bd))

### Bug Fixes

* require nodejs v22.12.0 or later ([d4c2a07](https://github.com/Forsakringskassan/commitlint-config/commit/d4c2a0761843c3c4ae34f5b940ab638dabe1d4da))

## [2.0.5](https://github.com/Forsakringskassan/commitlint-config/compare/v2.0.4...v2.0.5) (2025-08-15)

### Bug Fixes

* **deps:** update dependency lint-staged to v16.1.5 ([22880fd](https://github.com/Forsakringskassan/commitlint-config/commit/22880fd622aa1af00d6fc424226f85c99d8fbc3f))

## [2.0.4](https://github.com/Forsakringskassan/commitlint-config/compare/v2.0.3...v2.0.4) (2025-08-08)

### Bug Fixes

* **deps:** update dependency lint-staged to v16.1.4 ([94e3228](https://github.com/Forsakringskassan/commitlint-config/commit/94e32288dcd56205929a9150042d57b7bf85812d))

## [2.0.3](https://github.com/Forsakringskassan/commitlint-config/compare/v2.0.2...v2.0.3) (2025-06-20)

### Bug Fixes

* **deps:** update dependency lint-staged to v16.1.1 ([4f383ef](https://github.com/Forsakringskassan/commitlint-config/commit/4f383ef82da53a1e6196983f3fafd6e73c7416f0))
* **deps:** update dependency lint-staged to v16.1.2 ([ca9e4a1](https://github.com/Forsakringskassan/commitlint-config/commit/ca9e4a16f56ea7fdb881aa7c52ed345aeafb2b0c))

## [2.0.2](https://github.com/Forsakringskassan/commitlint-config/compare/v2.0.1...v2.0.2) (2025-06-06)

### Bug Fixes

* **deps:** update dependency lint-staged to v16.1.0 ([e66d4c4](https://github.com/Forsakringskassan/commitlint-config/commit/e66d4c4cb16b4650e0febf05976a0d9966bcea2a))

## [2.0.1](https://github.com/Forsakringskassan/commitlint-config/compare/v2.0.0...v2.0.1) (2025-05-15)

### Bug Fixes

* **deps:** fix missing lint-staged dependency ([d889a4e](https://github.com/Forsakringskassan/commitlint-config/commit/d889a4e0916f0c7b83d53601f829f00152ca0eb5))

## [2.0.0](https://github.com/Forsakringskassan/commitlint-config/compare/v1.4.2...v2.0.0) (2025-05-14)

### ⚠ BREAKING CHANGES

* nodejs v20 or later is now required

### Features

* bundle lint-staged and configuration ([0fb0903](https://github.com/Forsakringskassan/commitlint-config/commit/0fb09036260a6010516dbd5652a5e950385aea4e))
* **deps:** update dependency lint-staged to v16 ([851a484](https://github.com/Forsakringskassan/commitlint-config/commit/851a4840ebe3a52b4933ed9e237ce197c6a5db43))
* require nodejs v20 or later ([0a672af](https://github.com/Forsakringskassan/commitlint-config/commit/0a672afa012c061ccae196de7ac548ed15b2f184))

### Bug Fixes

* **deps:** update commitlint monorepo to v19.8.1 ([3fb4d3c](https://github.com/Forsakringskassan/commitlint-config/commit/3fb4d3cce2b6c96ce01f84699149c893d84087ee))

## [1.4.2](https://github.com/Forsakringskassan/commitlint-config/compare/v1.4.1...v1.4.2) (2025-03-14)

### Bug Fixes

* **deps:** update commitlint monorepo to v19.8.0 ([ad9f3a9](https://github.com/Forsakringskassan/commitlint-config/commit/ad9f3a9dbc782b7e869e6f4dc89334a8affebe9e))

## [1.4.1](https://github.com/Forsakringskassan/commitlint-config/compare/v1.4.0...v1.4.1) (2025-02-07)

### Bug Fixes

* **deps:** update commitlint monorepo to v19.7.1 ([8673acf](https://github.com/Forsakringskassan/commitlint-config/commit/8673acf8d4bfc15bc476b0f833d25c8cc26a1873))

## [1.4.0](https://github.com/Forsakringskassan/commitlint-config/compare/v1.3.6...v1.4.0) (2024-12-20)

### Features

* **deps:** update dependency is-ci to v4 ([ef06988](https://github.com/Forsakringskassan/commitlint-config/commit/ef069889e135be962ae39d07bcf35259d8e90e57))

### Bug Fixes

* **deps:** update dependency @commitlint/cli to v19.6.1 ([3cb245a](https://github.com/Forsakringskassan/commitlint-config/commit/3cb245a37801a25237320a23da9df3adedb07b0e))

## [1.3.6](https://github.com/Forsakringskassan/commitlint-config/compare/v1.3.5...v1.3.6) (2024-11-29)


### Bug Fixes

* **deps:** update dependency @commitlint/cli to v19.6.0 ([3ef11ee](https://github.com/Forsakringskassan/commitlint-config/commit/3ef11ee76e7837648ed4d88d22443635b5d37e3f))
* **deps:** update dependency @commitlint/config-conventional to v19.6.0 ([534437c](https://github.com/Forsakringskassan/commitlint-config/commit/534437c7305b36befc1b2eacef2bf29c7afeee9b))

## [1.3.5](https://github.com/Forsakringskassan/commitlint-config/compare/v1.3.4...v1.3.5) (2024-09-20)


### Bug Fixes

* **deps:** update dependency @commitlint/cli to v19.5.0 ([66809fd](https://github.com/Forsakringskassan/commitlint-config/commit/66809fd78a6619dd15ac9edabeae8c75b273cb05))
* **deps:** update dependency @commitlint/config-conventional to v19.5.0 ([6106d4a](https://github.com/Forsakringskassan/commitlint-config/commit/6106d4a437e994b47ab8e51df6c5b0950f5e3182))

## [1.3.4](https://github.com/Forsakringskassan/commitlint-config/compare/v1.3.3...v1.3.4) (2024-09-06)


### Bug Fixes

* **deps:** update dependency @commitlint/cli to v19.4.1 ([1f55c7a](https://github.com/Forsakringskassan/commitlint-config/commit/1f55c7a19457918f51d84ead9dfd15b37516eb9e))
* **deps:** update dependency @commitlint/config-conventional to v19.4.1 ([9b7274c](https://github.com/Forsakringskassan/commitlint-config/commit/9b7274c23389a9119306b2f3ec8d1a35315fe86e))

## [1.3.3](https://github.com/Forsakringskassan/commitlint-config/compare/v1.3.2...v1.3.3) (2024-08-16)


### Bug Fixes

* **deps:** update dependency @commitlint/cli to v19.4.0 ([ac0dc25](https://github.com/Forsakringskassan/commitlint-config/commit/ac0dc25af9b6409b39e0f49f728d854a3726c426))

## [1.3.2](https://github.com/Forsakringskassan/commitlint-config/compare/v1.3.1...v1.3.2) (2024-05-03)


### Bug Fixes

* **deps:** update dependency @commitlint/cli to v19.3.0 ([5259433](https://github.com/Forsakringskassan/commitlint-config/commit/525943374cc0260df522f1a911030d32686f2aa0))

## [1.3.1](https://github.com/Forsakringskassan/commitlint-config/compare/v1.3.0...v1.3.1) (2024-04-19)


### Bug Fixes

* **deps:** update dependency @commitlint/cli to v19.2.2 ([e677619](https://github.com/Forsakringskassan/commitlint-config/commit/e677619876596088a5efe032e438c7b2e94a4781))
* **deps:** update dependency @commitlint/config-conventional to v19.2.2 ([6c5a6d0](https://github.com/Forsakringskassan/commitlint-config/commit/6c5a6d0cd2a46c1bc04254321f06a8f8987d32d4))

## [1.3.0](https://github.com/Forsakringskassan/commitlint-config/compare/v1.2.1...v1.3.0) (2024-04-12)


### Features

* **deps:** update dependency commitlint to v19 ([cc1d9a5](https://github.com/Forsakringskassan/commitlint-config/commit/cc1d9a595a1d192bb2f84957dc7cf03d7b88ece6))

## [1.2.1](https://github.com/Forsakringskassan/commitlint-config/compare/v1.2.0...v1.2.1) (2024-03-15)


### Bug Fixes

* **deps:** update dependency is-ci to v3.0.1 ([4172417](https://github.com/Forsakringskassan/commitlint-config/commit/4172417eb9d1fafa67d2984483e7129d67197afc))

## [1.2.0](https://github.com/Forsakringskassan/commitlint-config/compare/v1.1.0...v1.2.0) (2024-02-29)


### Features

* initial public version ([e94272f](https://github.com/Forsakringskassan/commitlint-config/commit/e94272f4e21372781cbf6b45b54ea5ac1ab9d463))
