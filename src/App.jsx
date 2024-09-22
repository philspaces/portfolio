import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { ComingSoon, Hero, Navbar } from "./components/index.js";
import { useRef } from "react";

function App() {
  const wrapperRef = useRef(null);

  return (
    <BrowserRouter>
      <div className="relative z-0 bg-primary">
        <Navbar />
        <div className="wrapper" ref={wrapperRef}>
          <div id="hero" className="z-10">
            <Hero scrollContainer={wrapperRef} />
          </div>
          <div id="coming-soon" className="relative z-30 bg-primary mt-[-2px]">
            <ComingSoon />
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
