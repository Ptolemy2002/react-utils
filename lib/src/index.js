import React, { memo } from "react";
import clsx from "clsx";
import isCallable from "is-callable";

function compareChildren(a, b) {
    if (a === b) return true;
    if (typeof a !== "object" || typeof b !== "object") return false; // We already know they're not equal.

    const aIsArray = Array.isArray(a);
    const bIsArray = Array.isArray(b);

    if (aIsArray && bIsArray) {
        if (a.length !== b.length) return false;
        return a.every((item, index) => compareChildren(item, b[index]));
    }
    if (aIsArray || bIsArray) return false; // We already know they're not both arrays, so if one is an array, they're not equal.
    
    if (a.key || b.key) return a.key === b.key; // Compare keys if they exist.
    if (a.type !== b.type) return false;

    return compareChildren(a.props.children, b.props.children);
}

export const partialMemo = (component, deps=[], displayName) => {
    const result = memo(component, (prevProps, nextProps) => {
        // The function returns true if a re-render is NOT needed. This may seem counterintuitive, but it is consistent with how
        // React.memo works.
        if (deps.length === 0) return true;

        const defaultBehavior = (prop) => {
            if (prop === "children") return compareChildren(prevProps.children, nextProps.children);
            return prevProps[prop] === nextProps[prop];
        };

        return deps.every((dep) => {
            if (isCallable(dep)) return dep(prevProps, nextProps, defaultBehavior);
            return defaultBehavior(dep);
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