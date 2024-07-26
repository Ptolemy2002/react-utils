import React, { memo } from "react";
import clsx from "clsx";

export const Spacer = memo(function({ size = "1rem", horizontal = false, style={}, className=null, ...props }={}) {
    const keyName = horizontal ? "width" : "height";
    return <div className={clsx("spacer", className)} style={{ ...style, [keyName]: size }} {...props} />;
});