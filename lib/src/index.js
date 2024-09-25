import React, { memo } from "react";
import clsx from "clsx";
import isCallable from "is-callable";

export const partialMemo = (component, deps=[], displayName) => {
    const result = memo(component, (prevProps, nextProps) => {
        // The function returns true if a re-render is NOT needed. This may seem counterintuitive, but it is consistent with how
        // React.memo works.
        if (deps.length === 0) return true;
        return deps.every((dep) => {
            if (isCallable(dep)) return dep(prevProps, nextProps, (prev, next) => prev === next);
            return prevProps[dep] === nextProps[dep];
        });
    });

    if (!displayName) {
        result.displayName = (component.displayName ?? component.name) + " (Memo)";
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