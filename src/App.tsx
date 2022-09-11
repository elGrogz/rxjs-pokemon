import React, { useEffect, useState, useMemo } from "react";
import "./App.css";

// import the obervable subject
import { PokemonProvider, usePokemon } from "./store";
import { useObservableState } from "observable-hooks";
import { BehaviorSubject, combineLatestWith, map } from "rxjs";
// import { rawPokemon$ } from "./store"

const Deck = () => {
  const { deck$ } = usePokemon();
  const deck = useObservableState(deck$, []);

  return (
    <div>
      <h4>Deck</h4>
      <div>
        {deck.map((p) => (
          <div key={p.id} style={{ display: "flex" }}>
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
              alt={p.name}
            />
            <div>{p.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Search = () => {
  const { pokemon$, selected$ } = usePokemon();

  // state to store and update the search term
  const search$ = useMemo(() => new BehaviorSubject(""), []);
  // const [search, setSearch] = useState("");

  // state to store and update the full list of pokemon
  const pokemon = useObservableState(pokemon$, []);

  const [filteredPokemon] = useObservableState(() =>
    pokemon$.pipe(
      combineLatestWith(search$),
      map(([pokemon, search]) => {
        pokemon.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );
      })
    )
  );

  // NOT NEEDED WHEN YOU HAVE USEOBSERVABLESTATE
  // run when the component is mounted
  // useEffect(() => {
  //   // subscribe to the observable which returns the list of pokemon after it's fetched and then set the
  //   // state to be the full list
  //   const subscription = pokemon$.subscribe(setPokemon);

  //   // when the component unmounts, unsubscribe from the observable
  //   return () => subscription.unsubscribe();
  // }, []);

  // useMemo so filteredPokemon only runs when one of it's dependencies (pokemon or search) changes
  // const filteredPokemon = useMemo(() => {
  //   // filter pokemon based on the search and their name
  //   return pokemon.filter((p) =>
  //     p.name.toLowerCase().includes(search$.value.toLowerCase())
  //   );
  // }, [pokemon, search]);

  useEffect(() => {
    console.log("POKEMON: ", pokemon);
    console.log("SELECTED: ", selected$);
  }, [pokemon]);

  return (
    <div>
      {/* every changes causes the search term to update, and we display it with valye */}
      <input
        type="text"
        value={search$.value}
        onChange={(event) => search$.next(event.target.value)}
      />
      <div>
        {/* show the filtered pokemon with a map function */}
        {filteredPokemon.map((p) => (
          <div key={p.name}>
            <input
              type="checkbox"
              // check box if it's selected attribute is true
              checked={p.selected}
              //on change, if the selected array includes the rendered pokemon, update the selected array to not include the id
              onChange={() => {
                if (selected$.value.includes(p.id)) {
                  selected$.next(selected$.value.filter((id) => id !== p.id));
                  // otherwise if not already selected,
                } else {
                  selected$.next([...selected$.value, p.id]);
                }
              }}
            />
            <strong>{p.name}:</strong> {p.power}
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  return (
    <PokemonProvider>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        <Search />
        <Deck />
      </div>
    </PokemonProvider>
  );
}

export default App;
