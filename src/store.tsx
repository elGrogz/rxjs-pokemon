import { BehaviorSubject, map } from "rxjs";

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
}

// create an observable subject
// behavior subjects require an initial value and emits the current value when subscribed
const rawPokemon$ = new BehaviorSubject<Pokemon[]>([]);

// 'pipes' the output of rawPokemon  to the rxjs function
export const pokemonWithPower$ = rawPokemon$.pipe(
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

// get the data from the file, get the response as json, then set the next value of the observable as the data
fetch('/pokemon-data.json')
    .then(res => res.json())
    .then(data => rawPokemon$.next(data))