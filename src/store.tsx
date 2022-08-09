import { BehaviorSubject, map, combineLatestWith } from "rxjs";

import { createContext, useContext } from 'react'

export interface Pokemon {
    id: number;
    name: string;
    type: string[];
    hp: number;
    attack: number;
    defense: number;
    special_attack: number;
    special_defense: number;
    speed: number;
    power?: number;
    selected?: boolean;
}

// create an observable subject
// behavior subjects require an initial value and emits the current value when subscribed
const rawPokemon$ = new BehaviorSubject<Pokemon[]>([]);

// 'pipes' the output of rawPokemon  to the rxjs function
const pokemonWithPower$ = rawPokemon$.pipe(
    // takes the list of rawPokemon
    map((pokemon) => 
        // create a new array of pokemon
        pokemon.map((p) => (
            {
                //first spread the array with the initial values
                ...p,
                // add a new power attribute
                power: p.hp + p.attack + p.defense + p.special_attack + p.special_defense + p.speed,
            }))
    )
);

// keeps a list of the id's that we've selected
export const selected$ = new BehaviorSubject<number[]>([]);

export const pokemon$ = pokemonWithPower$.pipe(
    // add the selected observable to the pokemon one
    // when anything here changes, pokemon$ is recalculated
    combineLatestWith(selected$),
    //create a new output using both inputs (does it just know to use pokemonWithPower and selected as argument 1 and 2?)
    map(([pokemon, selected]) => 
        // new array output with map that has true or false for if the pokemon (by id) is in the selected array
      pokemon.map((p) => ({
        ...p,
        selected: selected.includes(p.id),
      }))
    )
)

// observable to include any pokemon that are selected in the deck\
// runs anytime pokemon$ changes
export const deck$ = pokemon$.pipe(
    map((pokemon) => pokemon.filter((p) => p.selected))
)


// get the data from the file, get the response as json, then set the next value of the observable as the data
fetch('/pokemon-data.json')
    .then(res => res.json())
    .then(data => rawPokemon$.next(data))

const PokemonContext = createContext({
    pokemon$,
    selected$,
    deck$,
});

export const PokemonProvider: React.FunctionComponent = ({ children }) => (
    <PokemonContext.Provider value={{
        pokemon$,
        selected$,
        deck$
    }}
    >
        {children}
    </PokemonContext.Provider>
)