# Contributing to react-mapfilter

## Development Environment

React and all the dev trimmings are a pain to set up, but they seem to be worth it in the long-run. I've tried to minimize complexity and document configuration as much as possible. I recommend configuring your editor to run Prettier on save, to lint files with eslint, and to automatically run flow to find type errors, but you can also just run these checks periodically with npm scripts.

### Code Style

```sh
npm run prettier
```

[Prettier](https://github.com/prettier/prettier) formats the code automatically, so you never have to worry about it. The style might not be to your liking, but you will probably be happier if you just embrace it and not think about code formatting ever again. Write code however you want then `npm run prettier` to format all your code. Prettier also runs automatically as a commit hook using [pretty-quick](https://github.com/azz/pretty-quick#readme).

### ESLint

```sh
npm run lint
```

All of the style format rules have been removed from the eslint config, since formatting is all done by Prettier. The rather complicated [.eslintrc](.eslintrc) config uses rules from [standardjs](https://standardjs.com/) and react and flow recommended rules in order to enforce code correctness. The rules are to avoid syntax errors and also code styles which can cause bugs, like not handling an error from a callback, or re-declaring a variable. You can configure your editor to use eslint, or lint files in the cli with `npm run lint`.

### Flow

```sh
npm run flow
```

[Flow](http://flow.org/) is a static type checker which can be a little bit of a pain to learn, but can really help with finding bugs in your code. It does a lot of work without any config - it infers types and discovers when you are trying to do something you shouldn't with an undefined variable, for example. Flow is opt-in and will only check files that start with the comment `// @flow`. I recommend always using this. You can add [type annotations](https://flow.org/en/docs/types/) to help flow infer types. If you see a semi-colon `:` where it shouldn't be in normal JavaScript, it's probably a type annotation. The little effort of learning the syntax does pay off with finding bugs (if you write code as badly as me at least). If you are getting a type error but the code seems fine you can ignore the line with `// $FlowFixMe` on the preceding line. If you set up editor integration you will be able to see type errors and details about all your types within your editor. Run it on the whole repo with `npm run flow`.

### Flow Typed

[`flow-typed`](https://github.com/flow-typed/flow-typed) is a collection of flow type annotations for modules that don't have them. `npm run flow-typed` will install types for all your dependencies, updating what is already there if needed (except the files that we have manually modified). Flow automatically reads the type declarations in this folder. If you want to add type definitions for any dependencies manually, you can do so in this folder. After installing a new dependency you should run `npm run flow-typed` to install any type definitions needed.

### Babel

Ugh, [babel](https://babeljs.io/). Babel allows us to use [JSX](https://reactjs.org/docs/introducing-jsx.html), it removes flow type annotations, and it allows us to use "advanced" JavaScript features like `import` and `export` instead of `require()`. Some of these are useful (e.g. `import`) because they allow static analysis, others are just syntax sugar to save repeated keystrokes. I've tried to document the [babel config](.babelrc) so you can see the additional things babel is doing. We target the last 2 major versions browsers and we don't support Internet Explorer < 11. You probably won't notice babel until it doesn't work and gives you a cryptic error. Hopefully it will just run in the background transpiling your code.

### React Storybook

```sh
npm run storybook
```

[Storybook](https://storybook.js.org/) is pretty cool. It allows us to test out components with mocked properties. It has "hot loading" which means that if you have it open and make changes to code, the changes will appear automatically and quickly. It's really useful for seeing what your component looks like as you code it, and it works well for manual testing of components and interaction. Run `npm run storybook` in your terminal then open http://localhost:6006/ to see the "stories" for most of the components here. Keep it open to see the changes as you code.

### Tests

```sh
npm test
```

Tests are run with [Jest](https://jestjs.io) and use
[react-testing-library](https://testing-library.com). We try to avoid snapshot
tests and testing implementation details. If you are developing you might find
it useful to continuously run tests when files change:

```sh
npm test -- --watch
```

### Translations

[`react-intl`](https://github.com/formatjs/react-intl) is used for translations
and internationalization. Any strings should be defined at the top of each
module using
[`defineMessage`](https://github.com/formatjs/react-intl/blob/master/docs/API.md#definemessages)
but unlike with the react-intl docs message descriptors are of the format `[id]: message` and this is transformed at build-time to the message descriptor format
using
[babel-plugin-react-intl-auto](https://github.com/akameco/babel-plugin-react-intl-auto).
This plugin adds the component name and path to the id, so you do not need to
worry about creating globally unique ids.

Messages for translation are in the folder [`messages`](messages). `en.json`
files are generated from the default messages in the code, and should not be
modified, but translations can be added to other files and they will not be
over-written.

To extract updated messages if you change any of the message definitions in the
code:

```sh
npm run extract-messages
```

This script will run on a commit hook to ensure any updated messages are always
included in the commit.
