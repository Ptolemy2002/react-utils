import React, { memo } from "react";
import clsx from "clsx";
import isCallable from "is-callable";

export const partialMemo = (E, deps=[], displayName) => {
    const MemoWrapper = ({...props}) => {
        delete props.renderDeps;
        return <E {...props} />;
    };
    MemoWrapper.displayName = "MemoWrapper";

    const result = memo(MemoWrapper,
        ({renderDeps: prevRenderDeps = [], ...prevProps}, {renderDeps: nextRenderDeps = [], ...nextProps}) => {
            // The function returns true if a re-render is NOT needed. This may seem counterintuitive, but it is consistent with how
            // React.memo works.

            // Falsy renderDeps means always re-render.
            if (!nextRenderDeps) return false;

            // If the length of the renderDeps array changes, give a warning.
            if (prevRenderDeps.length !== nextRenderDeps.length) console.warn("Render deps length changed. This should not happen.");
            // If the renderDeps are both the same, give a warning.
            if (prevRenderDeps === nextRenderDeps) console.warn("Render deps are the same object across parent renders. This should not happen.");

            // If any of the renderDeps change, re-render.
            if (!nextRenderDeps.every((dep, i) => dep === prevRenderDeps[i])) return false;


            if (deps.length === 0) return true;
            const defaultBehavior = (prop) => {
                // Consider children as never changing, as it will cause a re-render every time
                // if compared like normal.
                if (prop === "children") return true; 
                return prevProps[prop] === nextProps[prop];
            };

            return deps.every((dep) => {
                if (isCallable(dep)) return dep(prevProps, nextProps, defaultBehavior);
                return defaultBehavior(dep);
            });
        });

    if (!displayName) {
        result.displayName = (E.displayName ?? E.name) + " (Memo)";
    } else {
        result.displayName = displayName;
    }

    return result;
}

export const Spacer = memo(function({ size = "1rem", horizontal = false, style={}, className=null, ...props }={}) {
    const keyName = horizontal ? "width" : "height";
    return <div className={clsx("spacer", className)} style={{ ...style, [keyName]: size }} {...props} />;
});
Spacer.displayName = "Spacer";