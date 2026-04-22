import "./App.css";
import { Hero, Navbar, Portfolio } from "./components/index.js";

function App() {
  return (
    <div className="min-h-screen bg-primary text-white">
      <Navbar />
      <Hero />
      <Portfolio />
    </div>
  );
}

export default App;
