import { memo, FunctionComponent, MemoExoticComponent, CSSProperties, HTMLAttributes, ReactElement } from "react";
import isCallable from "is-callable";
import clsx, { ClassValue } from "clsx";

export type Dep<P> = keyof P | ((prev: P, next: P, defaultBehavior: (prop: keyof P) => boolean) => boolean);

export function partialMemo<P>(E: FunctionComponent<P>, deps: Dep<P>[] = [], _displayName?: string)
    : MemoExoticComponent<FunctionComponent<P & { renderDeps?: any[] }>> {
    type PWithRenderDeps = P & { renderDeps?: any[] };
    const displayName = _displayName ?? E.displayName ?? E.name;
    
    const MemoWrapper = ({...props}: PWithRenderDeps) => {
        delete props.renderDeps;
        return <E {...props} />;
    };
    MemoWrapper.displayName = "MemoWrapper(" + displayName + ")";

    const result = memo(MemoWrapper, (
        { renderDeps: prevRenderDeps = [], ...prevProps }: PWithRenderDeps,
        { renderDeps: nextRenderDeps = [], ...nextProps }: PWithRenderDeps
    ): boolean => {
        // The function returns true if a re-render is NOT needed. This may seem counterintuitive, but it is consistent with how
        // React.memo works.

        // Falsy renderDeps means always re-render.
        if (!nextRenderDeps) return false;

        // If the length of the renderDeps array changes, assume a re-render is needed.
        if (prevRenderDeps.length !== nextRenderDeps.length) return false;
        // If the renderDeps are both the same, give a warning.
        if (prevRenderDeps === nextRenderDeps) console.warn("Render deps are the same object across parent renders. This should not happen.");

        // If any of the renderDeps change, re-render.
        if (nextRenderDeps.some((dep, i) => dep !== prevRenderDeps[i])) return false;

        if (deps.length === 0) return true;
        const defaultBehavior = (prop: keyof Omit<PWithRenderDeps, "renderDeps">): boolean => {
            // Consider children as never changing, as it will cause a re-render every time
            // if compared like normal.
            if (prop === "children") return true;
            return prevProps[prop] === nextProps[prop];
        };

        return deps.every((dep) => {
            // We're using "as" here a lot because TypeScript doesn't understand that P and Omit<PWithRenderDeps, "renderDeps"> are the same type.
            if (isCallable(dep)) return dep(prevProps as P, nextProps as P, defaultBehavior as (prop: keyof P) => boolean);
            return defaultBehavior(dep as Exclude<keyof P, "renderDeps">);
        });
    });

    result.displayName = "Memo(" + displayName + ")";
    return result as MemoExoticComponent<FunctionComponent<PWithRenderDeps>>;
}

export type SpacerProps = {
    size?: string | number,
    horizontal?: boolean,
    style?: CSSProperties,
    className?: ClassValue
} & Omit<HTMLAttributes<HTMLDivElement>, "className">;

export const Spacer = memo(function({ size = "1rem", horizontal = false, style={}, className=null, ...props }: SpacerProps): ReactElement {
    const keyName = horizontal ? "width" : "height";
    return <div className={clsx("spacer", className)} style={{ ...style, [keyName]: size }} {...props} />;
});
Spacer.displayName = "Spacer";