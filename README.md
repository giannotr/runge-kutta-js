# RungeKuttaJS

> JavaScript implementation of the classic Runge-Kutta method (RK4)

[![npm][npm-badge]][npm-url] [![build][build-badge]][build-url] [![coverage][coverage-badge]][coverage-url] [![Known Vulnerabilities][vulnerabilities-badge]][vulnerabilities-url] [![dependencies][dependencies-badge]][dependencies-url] [![size][size-badge]][size-url] [![types][types-badge]][types-url] [![unicorn][unicorn-badge]][unicorn-url] [![xo][xo-badge]][xo-url] [![license][license-badge]][license-url]

## Key notes / highlights

- Solves ordinary diffenrential equations numerically
- Less error prone than a Euler integration
- Works with single equations and systems of equations
- Minimal implementation

## Install

```console
$ npm install runge-kutta
```

## Usage

Suppose you want to predict the spread of a viral disease. The SIR model could be implemented and solved with the following four lines of code.

```js
import rungeKutta from 'runge-kutta';

// Setup parameters for the transmission speed (T)
// and the recovery rate R (R).
// This corresponds to a basic reproduction number equal to 3
// ~ T/R.
const T = .2143, R = 1/14;
// Define the set of ordinary differential equations.
const dSIR = (t, y) => [-T * y[0] * y[1], (T * y[0] - R) * y[1], R * y[1]];

// Solve the system and log the result (reduced to the infection count).
console.log(rungeKutta(dSIR, [1, .1, 0], [0, 14], .2).map(x => x[1]));
```

## API

### Methods

#### rungeKutta

&#9658; **rungeKutta**(`ODE`: initialValueFunction, `initialCondition`: number | number[], `range`: readonly [number, number], `stepSize` = 1): number[] | number[][]

Solves the the initial value problem given through `ODE`. It is specified through a function taking in a number for the undependent variable and a number or an array of numbers for the dependent variable(s):

```js
type initialValueFunction = (x: number, y: any) => any;
type initialValueFunctionSingle = (x: number, y: number) => number;
type initialValueFunctionMulti = (x: number, y: readonly number[]) => number[];
```

If the `initialCondition` is a number (or an array containg one number) the `rungeKutta` assumes a single variable problem, otherwise a multi variable problem.

##### Example (Single variable problem: y' = y, y(0) = 1)

```js
const dy = (t, y) => y;
const approxExp = rungeKutta(dy, 1, [0, 8], .1);
console.log(approxExp);
```

A multi variable problem is given in the introduction.

## Keywords

- math
- mathematics
- numerical
- numeric
- methods
- solve
- differential
- equation
- system
- equations
- calculus

## Dependencies

- [type-insurance](https://www.npmjs.com/package/type-insurance)

## Related

- [nsolvejs](https://www.npmjs.com/package/nsolvejs) - Solve equations numerically and regression analysis

## Maintainer

- [Ruben Giannotti](http://rubengiannotti.com) - ruben.giannotti@gmx.net - github.com/giannotr

[npm-badge]: https://img.shields.io/npm/v/runge-kutta.svg
[npm-url]: https://www.npmjs.com/package/runge-kutta
[build-badge]: https://travis-ci.org/giannotr/runge-kutta-js.svg?branch=master
[build-url]: https://travis-ci.org/giannotr/runge-kutta-js
[coverage-badge]: https://coveralls.io/repos/github/giannotr/runge-kutta-js/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/giannotr/runge-kutta-js?branch=master
[vulnerabilities-badge]: https://snyk.io/test/github/giannotr/runge-kutta-js/badge.svg?targetFile=package.json
[vulnerabilities-url]: https://snyk.io/test/github/giannotr/runge-kutta-js?targetFile=package.json
[dependencies-badge]: https://david-dm.org/giannotr/runge-kutta-js.svg
[dependencies-url]: https://david-dm.org/giannotr/runge-kutta-js
[size-badge]: https://badgen.net/packagephobia/publish/runge-kutta
[size-url]: https://packagephobia.now.sh/result?p=runge-kutta
[types-badge]: https://badgen.net/npm/types/runge-kutta
[types-url]: https://github.com/giannotr/runge-kutta-js/tree/master/src
[unicorn-badge]: https://img.shields.io/badge/unicorn-approved-ff69b4.svg
[unicorn-url]: https://www.youtube.com/watch?v=9auOCbH5Ns4
[xo-badge]: https://img.shields.io/badge/code_style-XO-5ed9c7.svg
[xo-url]: https://github.com/xojs/xo
[license-badge]: https://img.shields.io/github/license/giannotr/runge-kutta-js.svg
[license-url]: https://github.com/giannotr/runge-kutta-js/blob/master/LICENSE
