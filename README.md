# Financial

![CI](https://github.com/lmammino/financial/workflows/CI/badge.svg)

A Zero-Dependency TypeScript / JavaScript financial utility library inspired by [numpy-financial](https://github.com/numpy/numpy-financial/)

It does support the same functionality offered by `numpy-financial` but it only support scalar values (no numpy-like array values) and it does not support decimal values.


## Install

With `npm`:

```bash
npm install --save-dev financial
```

Or, with `yarn`:

```bash
yarn add financial
```


## Example usage:

```javascript
import { fv } from 'financial'

fv(0.05 / 12, 10 * 12, -100, -100) // 15692.928894335748
```


## Implemented functions

 - [X] `fv`
 - [X] `pmt`
 - [X] `nper`
 - [ ] `ipmt`
 - [ ] `ppmt`
 - [ ] `pv`
 - [ ] `rate`
 - [ ] `irr`
 - [ ] `npv`
 - [ ] `mirr`


## Local Development

Below is a list of commands you will probably find useful.

 - `npm start` or `yarn start`: Runs the project in development/watch mode. Your project will be rebuilt upon changes.
 - `npm run build` or `yarn build`: Bundles the package to the `dist` folder. The package is optimized and bundled with Rollup into multiple format (CommonJS, UMD, and ES Module).
 - `npm run build:docs` or `yarn build:docs`: Builds the API documentation in the `docs` folder using `typedoc`.
 - `npm test` or `yarn test`: Runs the test watcher (Jest) in an interactive mode. it runs tests related to files changed since the last commit.
 - `npm run test:watch` or `yarn test:watch`: runs the tests in watch mode


## Contributing

Everyone is very welcome to contribute to this project. You can contribute just by submitting bugs or
suggesting improvements by [opening an issue on GitHub](https://github.com/lmammino/financial/issues).

You can also submit PRs as long as you adhere with the code standards and write tests for the proposed changes.

## License

Licensed under [MIT License](LICENSE). © Luciano Mammino.