# Contributing to MapFilter

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

MapFilter v1.x is built with [React](http://facebook.github.io/react/) and [Redux](http://redux.js.org). Please make yourself familiar with these libraries by reading the [docs](http://facebook.github.io/react/docs/getting-started.html). This [video series](https://egghead.io/series/getting-started-with-redux) is an excellent intro to Redux.

## Code Style & Linting

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

Mapfilter follows [JavaScript Standard Style](https://github.com/feross/standard), to keep things consistent and avoid arguments. It is written in [ES2015](http://babeljs.io/docs/learn-es2015/), including a couple of useful experimental features that are not part of ES2015: [class-properties](https://github.com/jeffmo/es-class-static-properties-and-fields) and [object-rest-spread](https://github.com/sebmarkbage/ecmascript-rest-spread). These two experimental features [make coding with React easier](http://babeljs.io/blog/2015/06/07/react-on-es6-plus) e.g. allowing us to automatically bind instance methods by combining arrow functions and class properties.

We don't (yet) use [ES2015 module syntax](https://babeljs.io/docs/learn-es2015/#modules) because the [standard for module loading](https://whatwg.github.io/loader/) was not included in ES2015 and is not yet finalized, and ES2015 module syntax was giving some headaches with certain build and testing tools. Instead we use [CommonJS](https://nodejs.org/docs/latest/api/modules.html) module syntax throughout.

Check the [`standard` docs](http://standardjs.com/index.html#text-editor-plugins) for how to set up linting in your favourite text editor.

Once installed you should see live linting errors in your text editor, or you can `npm run lint` to lint all files with standard.

### Linting Config

Unfortunately configuring linting with Babel and React is a big pain right now. You don't have to worry about this, since everything is already configured, but here are details about the setup we use:

We configure standard in [`package.json`](./package.json) to use [`babel-eslint`](https://github.com/babel/babel-eslint) as a parser. We use [Babel](http://babeljs.io/) v6 to transpile code into ES5 Javascript that is compatible with most modern browsers. Babel v6 needs to be explicitly configured with plugins for each feature you want to transpile, or [use presets](http://babeljs.io/docs/plugins/#presets) to include shareable collections of plugins. We configure babel in [`.babelrc`](./.babelrc) to use presets [`es2015`](http://babeljs.io/docs/plugins/preset-es2015) and [`react`](http://babeljs.io/docs/plugins/preset-react/). We add two additional plugins for experimental features [class-properties](http://babeljs.io/docs/plugins/transform-class-properties) and [object-rest-spread](http://babeljs.io/docs/plugins/transform-object-rest-spread).

## Build tools

Mapfilter is built using the excellent [Browserify](http://browserify.org) which bundles modular code into a single code bundle that works in the browser. We use the browserify transform [babelify](https://github.com/babel/babelify) to use babel to transform bundled code.

## Hot Module Reloading

Hot Module Reloading allows live code editing without reloading the browser or loosing state. Changes are automatically injected into the open page as you save your code.

![react-transform-boilerplate](https://cloud.githubusercontent.com/assets/1539088/11611771/ae1a6bd8-9bac-11e5-9206-42447e0fe064.gif)

MapFilter uses [LiveReactload](https://github.com/milankinen/livereactload) to implement hot reloading with Browserify. This uses [babel-plugin-react-transform](https://github.com/gaearon/babel-plugin-react-transform) and [react-proxy@1.x](https://github.com/gaearon/react-proxy). It is configured in [`.babelrc`](./.babelrc) as a plugin ([see docs](https://github.com/milankinen/livereactload#installation)).

We use [budo](https://github.com/mattdesl/budo) as a dev server (budo defaults to the `--debug` option for Browserify, which enables source maps).

All you need to do is `npm start` which will use budo to start a server with bundled code and hot loading enabled.

## Redux DevTools Extension

[Redux DevTools](https://github.com/gaearon/redux-devtools) allows you to inspect actions and state and playback actions. If you install the [Redux DevTools Chrome Extension](https://github.com/zalmoxisus/redux-devtools-extension) you will be able to use the Redux DevTools as you develop MapFilter.

## Dependencies

Make sure you are not forgetting any dependencies, or including unnecessary dependencies, but running:

```
npm run dependency-check
```

