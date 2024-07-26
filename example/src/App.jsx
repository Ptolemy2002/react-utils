import { Spacer } from "@ptolemy2002/react-utils";

function App() {
    return (
        <div className="App p-3">
            <p className="p-0 m-0">A</p>
            <Spacer className="bg-primary" />
            <p className="p-0 m-0">B</p>
            <Spacer size="2rem" className="bg-secondary" />
            <div className="d-flex flex-row">
                <p className="p-0 m-0">C</p>
                <Spacer horizontal className="bg-success" />
                <p className="p-0 m-0">D</p>
            </div>
        </div>
    );
}

export default App;
