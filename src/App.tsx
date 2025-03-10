import "./App.css";
import Sudoku from "./components/Sudoku";

function App() {
  return (
    <div className="bg-gray-800 slashed-zero font-mono overflow-hidden min-h-screen flex justify-center items-center">
      <Sudoku />
    </div>
  );
}

export default App;
