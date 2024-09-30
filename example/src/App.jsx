import { useState } from "react";
import { Spacer, partialMemo } from "@ptolemy2002/react-utils";

function App() {
    const [value, setValue] = useState(0);
    const [other, setOther] = useState(0);
    const [childToggle, setChildToggle] = useState(0);
    console.log("App render");

    return (
        <div className="App p-3">
            <h2>Spacer Test</h2>
            <p className="p-0 m-0">A</p>
            <Spacer className="bg-primary" />
            <p className="p-0 m-0">B</p>
            <Spacer size="2rem" className="bg-secondary" />
            <div className="d-flex flex-row">
                <p className="p-0 m-0">C</p>
                <Spacer horizontal className="bg-success" />
                <p className="p-0 m-0">D</p>
            </div>

            <h2>partialMemo Test</h2>
            {
                // The "otherArray" prop is recreated every render, causing an equality check to fail.
                // Bercause the Child component is memoized with a partial equality check, this
                // phenomenon should not cause the RenderingChild component to re-render this often.
                // It should only re-render when the "value" prop changes and "other" prop changes
                // specifically to 3, not every time "other" or "otherArray" changes.
            }
            <p>
                value: {value} <br />
                other: {other}
            </p>
            <RenderingChild value={value} other={other} otherArray={[]} />
            
            {
                // The NonRenderingChild component is memoized with an empty equality check, so it should
                // never re-render, even if the props change.
            }
            <NonRenderingChild value={value} other={other} otherArray={[]} />

            <ChildWithChildren renderDeps={[childToggle]}>
                {
                    childToggle === 0 ? 
                        <p>ChildWithChildren 1</p>
                    : childToggle === 1 ?
                        <p>ChildWithChildren 2</p>
                    : null
                }
            </ChildWithChildren>

            <button onClick={() => setValue((prev) => prev + 1)}>Change Value</button>
            <button onClick={() => setOther((prev) => prev + 1)}>Change Other</button>
            <button onClick={() => setChildToggle((prev) => {if (++prev === 2) return 0; return prev;})}>Toggle Child</button>
        </div>
    );
}

const RenderingChild = partialMemo(() => {
        console.log("RenderingChild render");
        return <p>Look in the console to see how often the RenderingChild component re-renders.</p>;
    }, ["value", (_, { other }, _default) => _default("other") || other !== 3],
    // The function returns true if a re-render is NOT needed. This may seem counterintuitive, but it is consistent with how
    // React.memo works.
    "RenderingChild" // Optional display name for the component
);


const NonRenderingChild = partialMemo(() => {
    console.log("NonRenderingChild render");
    return <p>Look in the console to see how often the NonRenderingChild component re-renders.</p>;
}, [], "NonRenderingChild");

const ChildWithChildren = partialMemo(({children}) => {
    console.log("ChildWithChildren render");
    return children;
}, ["children"], "ChildWithChildren");

export default App;
