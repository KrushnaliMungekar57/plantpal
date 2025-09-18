import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Initial from "./Pages/Initial";
import Home from "./Pages/Home";
import Plantlib from "./Pages/Plantlib"
import PlantPalApp from "./Pages/PlantPalApp";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Initial />} />
        <Route path="/home" element={<Home />} />
        <Route path="/plantlib" element={<Plantlib />} />
         <Route path="/plantpalapp" element={<PlantPalApp />} />
      </Routes>
    </Router>
  );
}

export default App;
