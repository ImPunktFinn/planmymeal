import logo from './logo.svg';
import './App.css';
import Calendar from "./components/calendar";
import NavBar from "./components/navBar";

function App() {
  return (
    <div className="App">
        <NavBar />
        <Calendar />
    </div>
  );
}

export default App;
