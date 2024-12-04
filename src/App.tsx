import { useState, ReactNode } from "react";
import { PropsWithCustomChildren, Spacer, partialMemo } from "@ptolemy2002/react-utils";

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
                // The NonRenderingChild component is memoized with an empty deps array, so it should
                // never re-render, even if the props change.
            }
            <NonRenderingChild value={value} other={other} otherArray={[]} />

            {
                // The ChildWithChildren component is memoized with the children prop, but children
                // prop changes don't cause a re-render according to the default behavior. Therefore,
                // we add childToggle as a render dependency to force a re-render when the childToggle
                // state changes, as that means the children have also changed.
            }
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

            <h2>PropsWithCustomChildren Test</h2>
            <BodyAndTwoRows>
                {{
                    header: <p>Header</p>,
                    row1: <>
                        <p>Row</p>
                        <p>1</p>
                    </>,
                    row2: <p>Row 2</p>
                }}
            </BodyAndTwoRows>
        </div>
    );
}

type Props = {
    value?: number,
    other?: number,
    otherArray?: any[],
    children?: ReactNode
};

const RenderingChild = partialMemo<Props>(() => {
        console.log("RenderingChild render");
        return <p>Look in the console to see how often the RenderingChild component re-renders.</p>;
    }, ["value", (_, { other }, _default) => _default("other") || other !== 3],
    // The function returns true if a re-render is NOT needed. This may seem counterintuitive, but it is consistent with how
    // React.memo works.
    "RenderingChild" // Optional display name for the component
);


const NonRenderingChild = partialMemo<Props>(() => {
    console.log("NonRenderingChild render");
    return <p>Look in the console to see how often the NonRenderingChild component re-renders.</p>;
}, [], "NonRenderingChild");

const ChildWithChildren = partialMemo<Props>(({children}) => {
    console.log("ChildWithChildren render");
    return children;
}, ["children"], "ChildWithChildren");

export default App;

function BodyAndTwoRows({ children: {header, row1, row2}={} }: PropsWithCustomChildren<{}, {header: ReactNode, row1: ReactNode, row2: ReactNode}>) {
    return (
        <div className="container">
            <div className="row border border-black">
                <div className="col text-center">
                    {header}
                </div>
            </div>

            <div className="row">
                <div className="col border border-black border-top-0">
                    {row1}
                </div>
                <div className="col border border-black border-top-0">
                    {row2}
                </div>
            </div>
        </div>
    );
}
