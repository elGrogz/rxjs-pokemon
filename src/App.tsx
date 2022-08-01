import React, { useEffect } from 'react';
import './App.css';

// import the obervable subect
import { pokemonWithPower$ } from "./store"



function App() {
  // on initial render, subject to the observable and log the initial value 
  useEffect(() => {
    // debugger
    pokemonWithPower$.subscribe(console.log);
  }, []);

  return (
    <div>
    </div>
  );
}

export default App;
