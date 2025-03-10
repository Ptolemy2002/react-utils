import {
  memo,
  FunctionComponent,
  MemoExoticComponent,
  CSSProperties,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  useState,
  useCallback,
  SetStateAction,
  useEffect,
} from "react";
import isCallable from "is-callable";
import clsx, { ClassValue } from "clsx";

export type Dep<P> =
  | keyof P
  | ((
      prev: P,
      next: P,
      defaultBehavior: (prop: keyof P) => boolean
    ) => boolean);

export function partialMemo<P>(
  E: FunctionComponent<P>,
  deps: Dep<P>[] = [],
  _displayName?: string,
  passRenderDeps = false
): MemoExoticComponent<
  FunctionComponent<P & { renderDeps?: unknown[] | null | false }>
> {
  type PWithRenderDeps = P & { renderDeps?: unknown[] | null | false };
  const displayName = _displayName ?? E.displayName ?? E.name;

  const MemoWrapper = ({ ...props }: PWithRenderDeps) => {
    if (!passRenderDeps) delete props.renderDeps;
    return <E {...props} />;
  };
  MemoWrapper.displayName = "MemoWrapper(" + displayName + ")";

  const result = memo(
    MemoWrapper,
    (
      { renderDeps: prevRenderDeps = [], ...prevProps }: PWithRenderDeps,
      { renderDeps: nextRenderDeps = [], ...nextProps }: PWithRenderDeps
    ): boolean => {
      // The function returns true if a re-render is NOT needed. This may seem counterintuitive, but it is consistent with how
      // React.memo works.

      // Falsy renderDeps means always re-render.
      if (!nextRenderDeps) return false;
      // Rerender if one is falsy and the other is not.
      if (!prevRenderDeps) return false;

      // If the length of the renderDeps array changes, assume a re-render is needed.
      if (prevRenderDeps.length !== nextRenderDeps.length) return false;
      // If the renderDeps are both the same, give a warning.
      if (prevRenderDeps === nextRenderDeps)
        console.warn(
          "Render deps are the same object across parent renders. This should not happen."
        );

      // If any of the renderDeps change, re-render.
      if (nextRenderDeps.some((dep, i) => dep !== prevRenderDeps[i]))
        return false;

      if (deps.length === 0) return true;
      const defaultBehavior = (
        prop: keyof Omit<PWithRenderDeps, "renderDeps">
      ): boolean => {
        // Consider children as never changing, as it will cause a re-render every time
        // if compared like normal.
        if (prop === "children") return true;
        return prevProps[prop] === nextProps[prop];
      };

      return deps.every((dep) => {
        // We're using "as" here a lot because TypeScript doesn't understand that P and Omit<PWithRenderDeps, "renderDeps"> are the same type.
        if (isCallable(dep))
          return dep(
            prevProps as P,
            nextProps as P,
            defaultBehavior as (prop: keyof P) => boolean
          );
        return defaultBehavior(dep as Exclude<keyof P, "renderDeps">);
      });
    }
  );

  result.displayName = "Memo(" + displayName + ")";
  return result as MemoExoticComponent<FunctionComponent<PWithRenderDeps>>;
}

export type SpacerProps = {
  size?: string | number;
  horizontal?: boolean;
  style?: CSSProperties;
  className?: ClassValue;
} & Omit<HTMLAttributes<HTMLDivElement>, "className">;

export const Spacer = memo(function ({
  size = "1rem",
  horizontal = false,
  style = {},
  className = null,
  ...props
}: SpacerProps): ReactElement {
  const keyName = horizontal ? "width" : "height";
  return (
    <div
      className={clsx("spacer", className)}
      style={{ ...style, [keyName]: size }}
      {...props}
    />
  );
});
Spacer.displayName = "Spacer";

export type PropsWithCustomChildren<
  P,
  C extends Record<string, ReactNode>
> = P & { children?: Partial<C> };

export function usePersistentState<T>(
  key: string,
  defaultValue: T,
  errorHandling?: (error: unknown) => T | undefined
): [T, (value: SetStateAction<T>) => void, () => void] {
  const [state, setState] = useState<T>(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
      try {
        return JSON.parse(storedValue) as T;
      } catch (error) {
        if (isCallable(errorHandling)) {
          const errorResult = errorHandling(error);
          if (errorResult !== undefined) return errorResult;
        }
        console.error(
          "Unhandled error parsing value",
          storedValue,
          "from localStorage:",
          error
        );
        throw error;
      }
    }
    return defaultValue;
  });

  const setPersistentState = useCallback(
    (value: SetStateAction<T>) => {
      setState((prevState) => {
        const newState = isCallable(value) ? value(prevState) : value;
        localStorage.setItem(key, JSON.stringify(newState));
        return newState;
      });
    },
    [key]
  );

  const clearPersistentState = useCallback(() => {
    setState(() => {
      localStorage.removeItem(key);
      return defaultValue;
    });
  }, [key, defaultValue]);

  return [state, setPersistentState, clearPersistentState];
}

export function useDebugRenderPrint(identifier: string, enabled = true) {
  const [seconds, setSeconds] = useState(0);
  if (enabled)
    console.debug(`${identifier}, seconds since last mount: ${seconds}`);

  useEffect(() => {
    const timer = setInterval(() => setSeconds(seconds + 1), 1000);
    return () => {
      if (enabled) console.debug(`${identifier}: #useEffect cleanup`);
      clearInterval(timer);
    };
  }, [seconds]);
}

export function createDebugHook(identifier: string) {
  let count = 0;
  return (enabled = true) => {
    count++;
    if (enabled) console.debug(`${identifier}: rendering (total: #${count}`);
    useDebugRenderPrint(identifier, enabled);
  };
}
