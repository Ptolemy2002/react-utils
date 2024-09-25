# React Utils
This library contains miscellaneous utilities for ReactJS development.

The functions are not exported as default, so you can import them in one of the following ways:
```
// ES6
import { functionName } from '@ptolemy2002/react-utils';
// CommonJS
const { functionName } = require('@ptolemy2002/react-utils');
```

## Components
The following components are available in the library:

### Spacer
#### Description
A component that creates space, but doesn't do anything else. The element has a custom "spacer" class in addition to any other classes that are passed in. In addition, the width or height style is overridden by the `size` prop depending on whether the `horizontal` prop is `true`. All other props and styles are passed as-is.

#### Props
- `size` (String): The size of the space. Can be any valid CSS size value. Default is '1rem'.
- `horizontal` (Boolean): Whether the space should be horizontal. Default is `false`.

### Returns
React Element - The spacer element, which is an empty `div`.

## Functions
The following functions are available in the library:

### partialMemo
#### Description
An extension to `React.memo` that allows re-render only when specific props change (or conditions are met) instead of the default behavior of comparing all props.

#### Parameters
- `component` (React Component): The component to memoize.
- `deps` (Array): An array containing items that can either be a string name of the prop to rerender when changed, or a function that returns `false` if the component should rerender, given a first argument of the old props, a second argument of the new props, and a third argument that is a function simply comparing two values shallowly. This may seem counterintuitive, but it is consistent with [how React.memo works](https://react.dev/reference/react/memo#:~:text=It%20should%20return%20true%20only%20if%20the%20new%20props%20would%20result%20in%20the%20same%20output%20as%20the%20old%20props%3B%20otherwise%20it%20should%20return%20false.). If not specified, this argument defaults to an empty array, meaning the component will not rerender on any prop change.
- `displayName` (String | undefined): The display name of the component. If not specified, this argument defaults to the display name of the input component plus a suffix of '(Memo)' to indicate that the component is memoized.

### Returns
React Component - A new component that is equivalent to the input component, but with the memoization behavior described above.

## Meta
This is a React Library Created by Ptolemy2002's [cra-template-react-library](https://www.npmjs.com/package/@ptolemy2002/cra-template-react-library) template in combination with [create-react-app](https://www.npmjs.com/package/create-react-app). It contains methods of building and publishing your library to npm.
For now, the library makes use of React 18 and does not use TypeScript.

## Peer Dependencies
These should be installed in order to use the library, as npm does not automatically add peer dependencies to your project.
- @types/react: ^18.3.3
- @types/react-dom: ^18.3.0
- react: ^18.3.1
- react-dom: ^18.3.1

## Commands
The following commands exist in the project:

- `npm run uninstall` - Uninstalls all dependencies for the library
- `npm run reinstall` - Uninstalls and then Reinstalls all dependencies for the library
- `npm run example-uninstall` - Uninstalls all dependencies for the example app
- `npm run example-install` - Installs all dependencies for the example app
- `npm run example-reinstall` - Uninstalls and then Reinstalls all dependencies for the example app
- `npm run example-start` - Starts the example app after building the library
- `npm run build` - Builds the library
- `npm run release` - Publishes the library to npm without changing the version
- `npm run release-patch` - Publishes the library to npm with a patch version bump
- `npm run release-minor` - Publishes the library to npm with a minor version bump
- `npm run release-major` - Publishes the library to npm with a major version bump