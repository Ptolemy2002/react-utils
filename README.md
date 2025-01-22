# React Utils
This library contains miscellaneous utilities for ReactJS development.

The functions are not exported as default, so you can import them in one of the following ways:
```javascript
// ES6
import { functionName } from '@ptolemy2002/react-utils';
// CommonJS
const { functionName } = require('@ptolemy2002/react-utils');
```

## Type Reference
```typescript
type Dep<P> = keyof P | ((prev: P, next: P, defaultBehavior: (prop: keyof P) => boolean) => boolean);
type SpacerProps = {
    size?: string,
    horizontal?: boolean,
    style?: React.CSSProperties,
    className?: clsx.ClassValue
} & Omit<React.HTMLAttributes<HTMLDivElement>, "className">;
type PropsWithCustomChildren<P, C extends Record<string, ReactNode>> = P & { children?: Partial<C> };
```

## Type Utilities
The following custom type utilities are available in the library:

### PropsWithCustomChildren<P, C>
#### Description
This extends existing props with `children` that can actually have multiple "slots" within it. It allows for a nice syntax:
```jsx
type MyComponentProps = PropsWithCustomChildren<{
    prop1: string,
    prop2: number
}, {
    slot1: ReactNode,
    slot2: ReactNode
}>;

const MyComponent: FC<MyComponentProps> = ({ prop1, prop2, children }) => {
    return (
        <div>
            {children.slot1}
            {children.slot2}
        </div>
    );
};

<MyComponent prop1="Hello" prop2={42}>
    {{
        slot1: <div>Slot 1</div>,
        slot2: <div>Slot 2</div>
    }}
</MyComponent>
```

#### Parameters
- `P` (`any`): The props object to extend.
- `C` (`Record<string, ReactNode>`): The object containing the custom children and their types.

## Hooks
The following hooks are available in the library:

### usePersistentState<T>
#### Description
A hook that creates a stateful value that persists across page reloads. The value is stored in `localStorage` and is updated whenever the state changes. The value is retrieved from `localStorage` when the hook is first called, and the initial value is used if the value is not found. Note that a value of `null` indicates that the value was not found in `localStorage`, so that should not be part of the valid state type.

#### Parameters
- `key` (`string`): The key to use in `localStorage`.
- `defaultValue` (`T`): The default value to use if the value is not found in `localStorage`.
- `errorHandling?` (`(error: unknown) => T | undefined`): A function to call when an error occurs. You can return a value to use in place of the error, or `undefined` to have the hook throw it. If not specified, the hook will always throw the error.

#### Returns
`[T, (value: SetStateAction<T>) => void, () => void]` - A list containing the current value, a function to update the value, and a function to clear the value from `localStorage`, removing the key and applying the `defaultValue` to state.

## Components
The following components are available in the library:

### Spacer
#### Description
A component that creates space, but doesn't do anything else. The element has a custom "spacer" class in addition to any other classes that are passed in. In addition, the width or height style is overridden by the `size` prop depending on whether the `horizontal` prop is `true`. All other props and styles are passed as-is.

#### Props
- `size` (`string | number`): The size of the space. Can be any valid CSS size value. Default is '1rem'.
- `horizontal` (`boolean`): Whether the space should be horizontal. Default is `false`.
- `style` (`React.CSSProperties`): The style of the space. Default is an empty object. This prop is passed as-is to the spacer element.
- `className` (`clsx.ClassValue`): The class name of the space. Default is `null`. This prop is passed as-is to `clsx` to combine with the custom "spacer" class.

### Returns
`ReactElement` - A `div` element that creates empty space.

## Functions
The following functions are available in the library:

### partialMemo<P>
#### Description
An extension to `React.memo` that allows re-render only when specific props change (or conditions are met) instead of the default behavior of comparing all props.

Note that the `children` prop is pointless to specify, as it will always return `true` since it would cause unecessary re-renders otherwise. The returned memoized component will take a prop called `renderDeps` with an array type that will not be passed to the original component by default, but will be used to allow an owner to specify additional dependencies that should trigger a re-render. `renderDeps` was initially introduced to calculate when children change without doing a deep comparison, but it can be used for any value that should trigger a re-render when it changes.

The parent should add any values the `children` depend on to this array and a new reference should be created every time the prop is passed. A falsy `renderDeps` value will cause the component to re-render every time the parent does, functionally equivalent to an un-memoized component. It is an empty array by default.

`P` is the type of the props object that the component takes.

#### Parameters
- `component` (`React.FunctionComponent<P>`): The component to memoize.
- `deps` (`Dep<P>[]`): An array containing items that can either be a string name of the prop to rerender when changed, or a function that returns `false` if the component should rerender, given a first argument of the old props, a second argument of the new props, and a third argument that is a function comparing the specified prop with the default method. This may seem counterintuitive, but it is consistent with [how React.memo works](https://react.dev/reference/react/memo#:~:text=It%20should%20return%20true%20only%20if%20the%20new%20props%20would%20result%20in%20the%20same%20output%20as%20the%20old%20props%3B%20otherwise%20it%20should%20return%20false.). If not specified, this argument defaults to an empty array, meaning the component will not rerender on any prop change.
- `_displayName` (`string?`): The display name of the component. If not specified, this argument defaults to the display name of the input component, whatever that may be.
- `passRenderDeps` (`boolean?`): Whether to pass the `renderDeps` prop to the component. If not specified, this argument defaults to `false`.

### Returns
`MemoExoticComponent<FunctionComponent<P & { renderDeps?: any[] | false | null }>>` - A memoized version of the input component that only re-renders when the specified props change or any of the `renderDeps` specified by the parent change.

## Peer Dependencies
These should be installed in order to use the library, as npm does not automatically add peer dependencies to your project.
- react: ^18.3.1
- react-dom: ^18.3.1
- clsx: ^2.1.1
- is-callable: ^1.2.7

## Commands
The following commands exist in the project:

- `npm run build` - Builds the library
- `npm run dev` - Starts the development server
- `npm run lint` - Lints the project
- `npm run uninstall` - Uninstalls all dependencies for the library and clears the cache
- `npm run reinstall` - Uninstalls, clears the cache, and then reinstalls all dependencies for the library
- `npm run release` - Publishes the library to npm without changing the version
- `npm run release-patch` - Publishes the library to npm with a patch version bump
- `npm run release-minor` - Publishes the library to npm with a minor version bump
- `npm run release-major` - Publishes the library to npm with a major version bump
