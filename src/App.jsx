import { useState } from "react";

import "./App.css";
import { Home } from "./components/pages/Home";
import { Rutas } from "./components/routing/rutas";

function App() {
  return (
    <>
      <div className="App">
        <Rutas />
      </div>
    </>
  );
}

export default App;
