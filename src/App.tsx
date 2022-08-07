import React, { useEffect, useState, useMemo } from 'react';
import './App.css';

// import the obervable subect
import { pokemon$, Pokemon, selected$ } from "./store"
// import { rawPokemon$ } from "./store"

const Search = () => {
  // state to store and update the search term
  const [search, setSearch] = useState(""); 

  // state to store and update the full list of pokemon
  const [pokemon, setPokemon] = useState<Pokemon[]>([]); 

  // run when the component is mounted
  useEffect(() => {
    // subscribe to the observable which returns the list of pokemon after it's fetched and then set the
    // state to be the full list
    const subscription = pokemon$.subscribe(setPokemon);

    // when the component unmounts, unsubscribe from the observable
    return () => subscription.unsubscribe();
  }, []);

  // useMemo so filteredPokemon only runs when one of it's dependencies (pokemon or search) changes
  const filteredPokemon = useMemo(() => {
    // filter pokemon based on the search and their name
    return pokemon.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }, [pokemon, search]);

  return (
    <div>
      {/* every changes causes the search term to update, and we display it with valye */}
      <input type="text" value={search} onChange={(event) => setSearch(event.target.value)}/>
      <div>
        {/* show the filtered pokemon with a map function */}
        {filteredPokemon.map((p) => (
          <div key={p.name}>
            <input type="checkbox" 
              checked={p.selected }
              onChange={() => {
                if (selected$.value.includes(p.id)) {
                  selected$.next(selected$.value.filter((id) => id !== p.id))
                } else {
                  selected$.next([...selected$.value, p.id])
                }
              }}/>
            <strong>{p.name}:</strong> {p.power}
          </div>
        ))}
      </div>
    </div>
  )
}
 
function App() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr"
    }}>
      <Search/>
    </div>
  );
}

export default App;